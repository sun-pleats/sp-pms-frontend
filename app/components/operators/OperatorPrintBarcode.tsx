import { Button } from 'primereact/button';
import React, { useContext, useEffect, useState } from 'react';
import Modal from '@/app/components/modal/component';
import { Operator } from '@/app/types/operator';
import { Checkbox } from 'primereact/checkbox';
import FormDropdown from '../form/dropdown/component';
import { SelectItem } from 'primereact/selectitem';
import { LayoutContext } from '@/layout/context/layoutcontext';
import useBarcodePrinting from '@/app/hooks/useBarcodePrinting';

interface SinglePrintBarcodeState {
  show?: boolean;
  saving?: boolean;
}

interface SinglePrintBarcodeProps {
  operator?: Operator;
  visible?: boolean;
  onHide?: any;
}

interface BarcodeDetail {
  name: string;
  value: string;
  checked: boolean;
}

const OperatorPrintBarcode = ({ operator, visible, onHide }: SinglePrintBarcodeProps) => {
  const [state, setState] = useState<SinglePrintBarcodeState>({});
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>();
  const [printerOptions, setPrinterOptions] = useState<SelectItem[]>([]);
  const [details, setDetails] = useState<BarcodeDetail[]>([]);
  const [selectedProcesses, setSelectedProcesses] = useState<BarcodeDetail[]>([]);

  const { showError } = useContext(LayoutContext);
  const { queuePrintOperatorProcess, fetchPrintersSelectOptions } = useBarcodePrinting();

  useEffect(() => {
    setState({ ...state, show: visible });
    if (visible) initData();
  }, [visible]);

  useEffect(() => {
    if (operator) {
      setDetails(
        operator.operator_processes?.map((r) => ({
          name: r.process.name,
          value: r.id?.toString() ?? '',
          checked: false
        })) ?? []
      );
    }
  }, [operator]);

  const onHideModal = () => {
    setState({ ...state, show: false });
    if (onHide) onHide();
  };

  const initData = async () => {
    setPrinterOptions(await fetchPrintersSelectOptions());
  };

  const onProcessChange = (e: any) => {
    let _selectedProcesses = [...selectedProcesses];

    if (e.checked) _selectedProcesses.push(e.value);
    else _selectedProcesses = _selectedProcesses.filter((category) => category.value !== e.value.value);

    setSelectedProcesses(_selectedProcesses);
  };

  const print = async () => {
    if (!selectedPrinter) {
      showError('Please select a printer.');
      return;
    }
    setState({ ...state, saving: true });

    // @NOTE: Change to operator printing
    await queuePrintOperatorProcess(
      selectedPrinter?.toString() ?? '',
      selectedProcesses.flatMap((r) => r.value)
    );
    setState({ ...state, saving: false });
  };

  return (
    <Modal title="Print Operator Process Barcode" width="50vh" visible={state.show} onHide={onHideModal} confirmSeverity="danger" hideActions={true}>
      <div className="flex flex-column gap-2">
        {details.map((category, index) => {
          return (
            <div key={index} className="flex align-items-center">
              <Checkbox
                inputId={`process-${index}`}
                name="category"
                value={category}
                onChange={onProcessChange}
                checked={selectedProcesses.some((item) => item.value === category.value)}
              />
              <label htmlFor={`process-${index}`} className="ml-2">
                {category.name}
              </label>
            </div>
          );
        })}
      </div>
      <p className="pb-2 pt-3 text-orange-500">Please select processes to print.</p>
      <FormDropdown
        label="Barcode Printer"
        value={selectedPrinter}
        onChange={(option: any) => setSelectedPrinter(option.value)}
        placeholder="Select"
        options={printerOptions}
      />
      <div className="flex">
        <div className="ml-auto">
          <Button onClick={print} loading={state.saving} icon="pi pi-print" severity="info" label="Print Barcode" className="mr-2" />
        </div>
      </div>
    </Modal>
  );
};

export default OperatorPrintBarcode;
