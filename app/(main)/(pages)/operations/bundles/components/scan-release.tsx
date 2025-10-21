'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import Modal from '@/app/components/modal/component';
import React, { useContext, useEffect, useRef, useState } from 'react';
import FormInputText from '@/app/components/form/input-text/component';
import { StyleBundleService } from '@/app/services/StyleBundleService';

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
      if (!value.length) return;
      const data = StyleBundleService.releaseFabricBundleBarcode(value);
      setScannedBarcode('');
      setHide();
      showSuccess('Bundle successfully released.');
    } catch (error) {
      showApiError(error, 'Error logging barcode.');
    } finally {
      setIsSaving(false);
    }
  };

  const setFocus = () => {
    if (userBarcodeRef) userBarcodeRef.current?.focus();
  };

  return (
    <Modal title="Scan & Release Bundle" minWidth="80vh" visible={state.show} onHide={onHide} hideActions={true}>
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
        className="w-full"
        placeholder="Please scan the bundle barcode here"
        inputClassName="w-full"
      />
    </Modal>
  );
};

export default ScanReleaseBundle;
