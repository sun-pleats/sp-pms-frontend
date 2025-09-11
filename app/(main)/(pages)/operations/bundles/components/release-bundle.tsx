'use client';

import { AutoCompleteSelectEvent } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { DefaultFormData } from '@/app/types/form';
import { FormReleaseBundle, StylePlannedFabricSize } from '@/app/types/styles';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Option } from '@/app/types';
import { SelectItem } from 'primereact/selectitem';
import { StyleBundleService } from '@/app/services/StyleBundleService';
import { StyleService } from '@/app/services/StyleService';
import { useForm } from 'react-hook-form';
import FormDropdown from '@/app/components/form/dropdown/component';
import Modal from '@/app/components/modal/component';
import React, { useContext, useEffect, useState } from 'react';
import ReleaseBundleTable from '@/app/components/style/ReleaseBundleTable';
import RemoteStyleDropdown from '@/app/components/remote/style-dropdown/component';
import useBarcodePrinting from '@/app/hooks/useBarcodePrinting';

interface SinglePrintBarcodeState {
  show?: boolean;
  loadingSave?: boolean;
  loadingFetch?: boolean;
}

interface SinglePrintBarcodeProps {
  visible?: boolean;
  onHide?: any;
}

interface FormData extends DefaultFormData {
  bundles: FormReleaseBundle[];
}

const ReleaseBundles = ({ visible, onHide }: SinglePrintBarcodeProps) => {
  const [state, setState] = useState<SinglePrintBarcodeState>({});
  const [selectedStyleNumber, setSelectedStyleNumber] = useState<Option | null>(null);
  const [colorOptions, setColorOptions] = useState<SelectItem[]>([]);
  const [printerOptions, setPrinterOptions] = useState<SelectItem[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>();
  const [sizesOptions, setSizesOptions] = useState<StylePlannedFabricSize[]>([]);
  const [isStyleSelected, setIsStyleSelected] = useState<boolean>(false);
  const [shouldPrint, setShouldPrint] = useState<boolean>(false);
  const { showApiError, showSuccess, showError } = useContext(LayoutContext);
  const { queuePrintStyleBundle, fetchPrintersSelectOptions } = useBarcodePrinting();

  const emptyStyleItem = (): FormReleaseBundle => ({
    id: 1,
    style_planned_fabric_id: '',
    style_planned_fabric_size_id: '',
    quantity: 0,
    remarks: ''
  });

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      bundles: []
    }
  });

  const fetchPlannedFabics = async (id: string) => {
    try {
      setState({ ...state, loadingFetch: true });
      const { data: res } = await StyleService.getPlannedFabrics(id);
      setColorOptions(
        res.colors.map((col) => ({
          label: col.color,
          value: col.id
        }))
      );
      setSizesOptions(res.sizes);
      reset({
        bundles: [emptyStyleItem()]
      });
      setIsStyleSelected(true);
    } catch (e: any) {
      setIsStyleSelected(false);
      showApiError(e, 'Error loading the planned fabric options.');
    } finally {
      setState({ ...state, loadingFetch: false });
    }
  };

  const releaseFabrics = async (e: FormData) => {
    if (shouldPrint && !selectedPrinter) {
      showError('Please select a printer.');
      return;
    }
    try {
      setState({ ...state, loadingSave: true });
      const { data: fabrics } = await StyleBundleService.releaseFabrics(
        {
          bundles: e.bundles?.map((r) => ({
            roll_number: r.roll_number,
            style_planned_fabric_id: r.style_planned_fabric_id,
            style_planned_fabric_size_id: r.style_planned_fabric_size_id,
            quantity: r.quantity,
            remarks: r.remarks
          }))
        },
        selectedStyleNumber?.value.toString() ?? ''
      );
      showSuccess('Bundles has been succesfully released.');

      if (shouldPrint) {
        queuePrintStyleBundle(
          selectedPrinter?.toString() ?? '',
          fabrics.flatMap((r) => r.id?.toString() ?? '')
        );
      }

      // Reset and close modal
      resetAllState();

      setTimeout(() => {
        //setHide();
      }, 2000);
    } catch (e: any) {
      showApiError(e, 'Error releasing bundles.');
    } finally {
      setState({ ...state, loadingSave: false });
    }
  };

  const loadFabricBundles = async () => {
    StyleBundleService.getStyleBundles(selectedStyleNumber?.value.toString() ?? '');
  };

  useEffect(() => {
    setState({ ...state, show: visible });
    if (visible) initData();
  }, [visible]);

  const initData = async () => {
    setPrinterOptions(await fetchPrintersSelectOptions());
    await loadFabricBundles();
  };

  const resetAllState = () => {
    setSelectedStyleNumber(null);
    setIsStyleSelected(false);
    reset({
      bundles: []
    });
    setShouldPrint(false);
  };
  const setHide = () => {
    setState({ ...state, show: false });
    if (onHide) onHide();
  };

  const handleSelectedStyle = (option: AutoCompleteSelectEvent<Option>) => {
    fetchPlannedFabics(option.value?.value?.toString());
  };

  const submit = (e: FormData) => {
    releaseFabrics(e);
  };

  return (
    <Modal title="Release Bundles" visible={state.show} minWidth="90vh" onHide={setHide} confirmSeverity="danger" hideActions={true}>
      <form onSubmit={handleSubmit(submit)}>
        <RemoteStyleDropdown value={selectedStyleNumber} onSelect={handleSelectedStyle} onChange={(option) => setSelectedStyleNumber(option)} />
        <div className="m-3"></div>
        <ReleaseBundleTable
          loading={state.loadingFetch}
          control={control}
          sizesOptions={sizesOptions}
          disabled={!isStyleSelected}
          colorOptions={colorOptions}
        />
        <div className="m-5"></div>
        <div className="flex align-items-end mt-b-2">
          <div className="ml-auto">
            <FormDropdown
              label="Barcode Printer"
              value={selectedPrinter}
              onChange={(option: any) => setSelectedPrinter(option.value)}
              placeholder="Select"
              filter
              options={printerOptions}
            />
            <Button
              loading={state.loadingSave}
              type="submit"
              disabled={!isStyleSelected}
              onClick={() => setShouldPrint(true)}
              icon="pi pi-print"
              severity="info"
              label="Release & Print"
              className="mr-2"
            />
            <Button
              loading={state.loadingSave}
              type="submit"
              disabled={!isStyleSelected}
              icon="pi pi-arrow-up-right"
              severity="info"
              label="Release"
              className="mr-2"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ReleaseBundles;
