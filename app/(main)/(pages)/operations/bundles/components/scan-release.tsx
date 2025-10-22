'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import Modal from '@/app/components/modal/component';
import React, { useContext, useEffect, useRef, useState } from 'react';
import FormInputText from '@/app/components/form/input-text/component';
import { StyleBundleService } from '@/app/services/StyleBundleService';
import { ProgressSpinner } from 'primereact/progressspinner';

interface SinglePrintBarcodeState {
  show?: boolean;
  loadingSave?: boolean;
  loadingFetch?: boolean;
}

interface SinglePrintBarcodeProps {
  visible?: boolean;
  onHide?: any;
}

const ScanReleaseBundle = ({ visible, onHide }: SinglePrintBarcodeProps) => {
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const userBarcodeRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<SinglePrintBarcodeState>({});
  const { showApiError, showSuccess, showError, showWarning } = useContext(LayoutContext);

  useEffect(() => {
    setState({ ...state, show: visible });
    setTimeout(() => {
      if (visible) setFocus();
    }, 500);
  }, [visible]);

  const setHide = () => {
    setState({ ...state, show: false });
    if (onHide) onHide();
  };

  const onLoggerBarcodeEnter = async (value: string) => {
    try {
      setIsSaving(true);
      if (!value.length) return;
      await StyleBundleService.releaseFabricBundleBarcode(value);
      showSuccess('Bundle successfully released.');
    } catch (error) {
      showApiError(error, 'Error logging barcode.');
    } finally {
      setIsSaving(false);
      setScannedBarcode('');
      setTimeout(() => {
        if (visible) setFocus();
      }, 500);
    }
  };

  const setFocus = () => {
    if (userBarcodeRef) userBarcodeRef.current?.focus();
  };

  return (
    <Modal title="Scan & Release Bundle" minWidth="80vh" visible={state.show} onHide={setHide} hideActions={true}>
      <p>Please use the scanner to scan the bundle barcode</p>
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
        disabled={isSaving}
        className="w-full"
        placeholder="Please scan the bundle barcode here"
        inputClassName="w-full"
      />
      {isSaving && (
        <div className="col-12 flex justify-content-center align-items-center">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
        </div>
      )}
    </Modal>
  );
};

export default ScanReleaseBundle;
