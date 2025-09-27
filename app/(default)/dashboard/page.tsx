'use client';

import './page.scss';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import DashboardTable from '@/app/components/dashboard/DashboardTable';
import { MachinePleatsDashboard } from '@/app/types/dashboard';
import DashboardService from '@/app/services/DashboardService';
import Modal from '@/app/components/modal/component';
import FormInputText from '@/app/components/form/input-text/component';
import { ProductionTargetService } from '@/app/services/ProductionTargetService';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ProgressSpinner } from 'primereact/progressspinner';

const INTERVAL_RELOAD = 60000; // 60 Seconds

const LandingPage = () => {
  const [isLoggerBarcodeShow, setIsLoggerBarcodeShow] = useState(false);
  const userBarcodeRef = useRef<HTMLInputElement>(null);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [logType, setLogType] = useState<'defects' | 'actual' | undefined>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [dashboard, setDashboard] = useState<MachinePleatsDashboard[]>([]);
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const fetchMachinePleatsStats = useCallback(async () => {
    const { data } = await DashboardService.fetchMachinePleatsStats();
    setDashboard(data);
  }, []);

  useEffect(() => {
    fetchMachinePleatsStats();
  }, [fetchMachinePleatsStats]);

  useEffect(() => {
    setInterval(() => {
      // Reload every 5 seconds
      fetchMachinePleatsStats();
    }, INTERVAL_RELOAD);
  }, []);

  const onLoggerBarcodeEnter = async (value: string) => {
    try {
      if (!value.length) return;
      setIsSaving(true);
      await ProductionTargetService.counterLog({
        barcode: value,
        log_type: logType?.toString() ?? ''
      });
      showSuccess('Target has been logged successfully.');
      setIsLoggerBarcodeShow(false);
      fetchMachinePleatsStats();
      setScannedBarcode('');
    } catch (error) {
      showApiError(error, 'Error logging barcode.');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (isLoggerBarcodeShow) setFocus();
    }, 500);
  }, [isLoggerBarcodeShow]);

  const setFocus = () => {
    if (userBarcodeRef) userBarcodeRef.current?.focus();
  };

  return (
    <>
      <div className="gradient-bg">
        <div className="w-full">
          <DashboardTable
            onScanActualClick={() => {
              setLogType('actual');
              setIsLoggerBarcodeShow(true);
            }}
            onScanDefectClick={() => {
              setLogType('defects');
              setIsLoggerBarcodeShow(true);
            }}
            buyers={dashboard}
          />
        </div>
      </div>
      <Modal
        title="Production Target"
        minWidth="90vh"
        visible={isLoggerBarcodeShow}
        onHide={() => {
          setIsLoggerBarcodeShow(false);
        }}
        hideActions={true}
        confirmSeverity="danger"
      >
        <h3>Scan {logType}</h3>
        <p>Please use the scanner to scan the bundle barcode and it will log as {logType}</p>
        {isSaving && (
          <div className="col-12 flex justify-content-center align-items-center">
            <ProgressSpinner style={{ width: '50px', height: '50px' }} />
          </div>
        )}
        <FormInputText
          onChange={(value: any) => setScannedBarcode(value.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // avoid form submit if inside a <form>
              onLoggerBarcodeEnter((e.target as HTMLInputElement).value.trim());
            }
          }}
          onBlur={() => setFocus()}
          ref={userBarcodeRef}
          value={scannedBarcode}
          className="w-full"
          placeholder="Please scan the bundle barcode here"
          inputClassName="w-full"
        />
      </Modal>
    </>
  );
};

export default LandingPage;
