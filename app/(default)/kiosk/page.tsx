'use client';

import { Button } from 'primereact/button';
import { formatDateTime } from '@/app/utils';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { ListBox } from 'primereact/listbox';
import { Skeleton } from 'primereact/skeleton';
import { useRouter } from 'next/navigation';
import Barcode from '@/app/components/barcode/Barcode';
import FormDropdown from '@/app/components/form/dropdown/component';
import FormInputText from '@/app/components/form/input-text/component';
import Link from 'next/link';
import Modal from '@/app/components/modal/component';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import useKiosk from './hooks/useKiosk';
import useUtilityData from '@/app/hooks/useUtilityData';

interface StyleDetail {
  name: string;
  value: string;
}

const LandingPage = () => {
  const [isLoggerBarcodeShow, setIsLoggerBarcodeShow] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [isReturnedShow, setIsReturnedShow] = useState(false);
  const [barcode, setBarcode] = useState<string>('NOBARCODE');

  const { layoutConfig } = useContext(LayoutContext);
  const barcodeBundleRef = useRef<HTMLInputElement>(null);
  const userBarcodeRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { fetchDepartmentOptions } = useUtilityData();
  const { showApiError } = useContext(LayoutContext);

  const { kioskFilters, setKioskFilters, setDepartmentOption, departmentOption, logStyleBundle, reset } = useKiosk();

  useEffect(() => {
    initData();
    setFocus();
  }, []);

  const initData = () => {
    fetchDepartmentOptions()
      .then((options) => setDepartmentOption(options))
      .catch((err) => showApiError(err, 'Failed to fetch departments.'));
  };
  const [details, setDetails] = useState<StyleDetail[]>([]);
  const [phase, setPhase] = useState<'in' | 'out' | undefined>();

  const itemTemplate = (item: StyleDetail) => {
    return (
      <div className="flex flex-wrap p-2 align-items-center gap-3">
        <div className="flex-1 flex flex-column gap-2 xl:mr-8">
          <span className="font-bold">{item.name}</span>
        </div>
        <span className="font-bold text-900">{item.value}</span>
      </div>
    );
  };

  const onEnter = (value: string) => {
    setKioskFilters({ ...kioskFilters, barcode: value });
    setIsLoggerBarcodeShow(true);
    setTimeout(() => {
      setFocus();
    }, 1500);
  };

  const logBundle = (filters: any) => {
    setIsLogging(true);
    logStyleBundle(filters)
      .then(({ data: log }) => {
        // Check if it is being returned to the department
        if (log.past_log) {
          setIsReturnedShow(true);
        } else {
          const { style_bundle } = log;

          // Set entry phase
          if (log.exit_time) setPhase('out');
          else if (log.entry_time) setPhase('in');

          setBarcode(style_bundle?.bundle_number ?? '');
          setDetails([
            { name: 'Style Number', value: style_bundle?.style?.style_number ?? '' },
            { name: 'Pleats Name', value: style_bundle?.style?.pleats_name ?? '' },
            { name: 'Color', value: style_bundle?.style_planned_fabric?.color ?? '' },
            { name: 'Size', value: style_bundle?.style_planned_fabric_size?.size_number?.toString() ?? '' },
            { name: 'Current Department', value: log.department?.name ?? '' },
            { name: 'Time In', value: formatDateTime(log.entry_time) },
            { name: 'Time Out', value: log.exit_time ? formatDateTime(log.exit_time) : '---' }
          ]);
          resetPageState();
        }
      })
      .finally(() => setIsLogging(false));
  };

  const resetPageState = () => {
    setIsLoggerBarcodeShow(false);
    setIsReturnedShow(false);
    reset();
  };

  const logBunddleReturned = (remarks: string) => {
    setKioskFilters({ ...kioskFilters, returned: true, remarks });
    logBundle({ ...kioskFilters, returned: true, remarks });
  };

  const onLoggerBarcodeEnter = (value: string) => {
    setKioskFilters({ ...kioskFilters, logger_barcode: value });
    logBundle({ ...kioskFilters, logger_barcode: value });
  };

  const setFocus = () => {
    if (!isLoggerBarcodeShow) barcodeBundleRef.current?.focus();
    else userBarcodeRef.current?.focus();
  };

  return (
    <>
      <div className="surface-0 flex align-items-center flex-row p-5">
        <div className="flex align-items-center gap-2">
          <FormDropdown
            value={kioskFilters.selectedDepartment}
            onChange={(option) => setKioskFilters({ ...kioskFilters, selectedDepartment: option.value })}
            label="Department"
            placeholder="Select department"
            options={departmentOption}
          />
          <Button label="Home" icon="pi pi-home" className="mt-2" onClick={() => router.push('/')}></Button>
        </div>
        <div id="home" className="landing-wrapper overflow-hidden">
          <div className="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static">
            <Link href="/" className="flex align-items-center">
              <img
                src={`/layout/images/${layoutConfig.colorScheme === 'light' ? 'logo-dark' : 'logo-white'}.svg`}
                alt="Sun Pleats Logo"
                height="50"
                className="mr-0 lg:mr-2"
              />
              <span className="text-900 font-medium text-2xl line-height-3 mr-8">Sunpleats Kiosk</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="card m-5">
        <div className="card-body">
          <div className="flex flex-column align-items-center m-auto m-5">
            {phase === 'in' && <h2 className="text-green-500">Logged In</h2>}
            {phase === 'out' && <h2 className="text-red-500">Logged Out</h2>}
            <Barcode value={barcode} />
          </div>
          <ListBox filter={false} dataKey="id" options={details} itemTemplate={itemTemplate} emptyMessage="Style Details" />
          <div className="mt-5">
            <FormInputText
              onChange={(value: any) => setKioskFilters({ ...kioskFilters, barcode: value.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // avoid form submit if inside a <form>
                  onEnter((e.target as HTMLInputElement).value.trim());
                }
              }}
              onBlur={() => setFocus()}
              value={kioskFilters.barcode}
              ref={barcodeBundleRef}
              className="w-full"
              placeholder="Please scan the barcode here"
              inputClassName="w-full"
            />
          </div>
        </div>
      </div>

      <Modal
        title="Logger"
        visible={isLoggerBarcodeShow}
        onHide={() => {
          resetPageState();
        }}
        hideActions={true}
        confirmSeverity="danger"
      >
        {isReturnedShow && (
          <>
            <p>
              <i className="pi pi-exclamation-triangle text-orange-500"></i> This bundle has already been recorded for entry to the department. Please
              select a reason.
            </p>
            <div className="card flex flex-wrap justify-content-center gap-3">
              <Button label="Damage" onClick={() => logBunddleReturned('Damage')} outlined />
              <Button label="Repair" onClick={() => logBunddleReturned('Repair')} severity="secondary" outlined />
              <Button label="Replacement" onClick={() => logBunddleReturned('Replacement')} severity="success" outlined />
            </div>
          </>
        )}

        {!isLogging ? (
          <FormInputText
            onChange={(value: any) => setKioskFilters({ ...kioskFilters, logger_barcode: value.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // avoid form submit if inside a <form>
                onLoggerBarcodeEnter((e.target as HTMLInputElement).value.trim());
              }
            }}
            onBlur={() => setFocus()}
            ref={userBarcodeRef}
            value={kioskFilters.logger_barcode}
            className="w-full"
            placeholder="Please scan the user barcode here"
            inputClassName="w-full"
          />
        ) : (
          <Skeleton width="100%" height="2.5rem" className="mb-2" borderRadius="8px"></Skeleton>
        )}
      </Modal>
    </>
  );
};

export default LandingPage;
