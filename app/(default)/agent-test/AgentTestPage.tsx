'use client';

import { AGENT_ERROR_RESPONSE } from '@/app/constants/agent';
import { Button } from 'primereact/button';
import { ERROR_MESSAGE_GENERIC } from '@/app/constants/messages';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useRouter } from 'next/navigation';
import FormDropdown from '@/app/components/form/dropdown/component';
import FormInputText from '@/app/components/form/input-text/component';
import Link from 'next/link';
import React, { useContext, useEffect, useRef, useState } from 'react';
import useAgentTestPage from './hooks/useAgentTestPage';
import useUtilityData from '@/app/hooks/useUtilityData';

const AgentTestPage = () => {
  const [isLoggerBarcodeShow, setIsLoggerBarcodeShow] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const { layoutConfig } = useContext(LayoutContext);
  const barcodeBundleRef = useRef<HTMLInputElement>(null);
  const userBarcodeRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { fetchSectionOptions } = useUtilityData();
  const { showApiError, showError } = useContext(LayoutContext);
  const { agentFilters, setAgentFilters, setSectionOption, sectionOption, logBarcode, logState, setLogState, setMessage, message } =
    useAgentTestPage();

  useEffect(() => {
    initData();
    setFocus();
  }, []);

  const initData = () => {
    fetchSectionOptions()
      .then((options) => setSectionOption(options))
      .catch((err) => showApiError(err, 'Failed to fetch sections.'));
  };

  const onEnter = (value: string) => {
    const filter = { ...agentFilters, barcode: value };
    setAgentFilters(filter);
    setIsLoggerBarcodeShow(true);
    logBundle(filter);
  };

  const logBundle = (filters: any) => {
    if (filters.barcode == '' || !filters.barcode) return;
    if (!filters.selectedSection || (filters.selectedSection && filters.selectedSection == '')) {
      showError('No section selected.', 'Required');
      return;
    }
    setLogState(null);
    setIsLogging(true);
    logBarcode(filters)
      .then(({ data }) => {
        setLogState('success');
        setMessage('Server returned success status and the barcode can be processed.');
        console.log(data);
      })
      .catch((error) => {
        const { response } = error;
        const result = response.data.message;
        setLogState('error');
        if (Object.keys(AGENT_ERROR_RESPONSE).includes(result)) {
          //@ts-ignore
          setMessage(AGENT_ERROR_RESPONSE[result]);
        } else {
          setLogState(null);
          showError(ERROR_MESSAGE_GENERIC, 'Unknown');
        }
      })
      .finally(() => {
        setIsLogging(false);
        setTimeout(() => {
          setFocus();
        }, 3000);
      });
  };

  const setFocus = () => {
    if (!isLoggerBarcodeShow) barcodeBundleRef.current?.focus();
    else userBarcodeRef.current?.focus();
  };

  return (
    <>
      <div className="surface-0 flex align-items-center gap-3 flex-row p-5">
        <Button icon="pi pi-home" rounded className="mt-2" severity="secondary" onClick={() => router.push('/')} tooltip="Back to home"></Button>
        <FormDropdown
          value={agentFilters.selectedSection}
          onChange={(option) => setAgentFilters({ ...agentFilters, selectedSection: option.value })}
          label="Selected Section"
          placeholder="Select section"
          options={sectionOption}
        />
        <div id="home" className="landing-wrapper overflow-hidden">
          <div className="flex align-items-center justify-content-between relative lg:static">
            <Link href="/" className="flex align-items-center">
              <img
                src={`/layout/images/${layoutConfig.colorScheme === 'light' ? 'logo-dark' : 'logo-white'}.svg`}
                alt="SUN-PLEATS CORP. Logo"
                height="50"
                className="mr-0 lg:mr-2"
              />
              <span className="text-900 font-medium text-2xl line-height-3 mr-8">SUN-PLEATS Line Agent Test</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="card m-5">
        <div className="card-body">
          <label className="block mb-1 font-semibold">Scan Barcode</label>
          <div className="flex gap-3 w-full">
            <FormInputText
              onChange={(value: any) => setAgentFilters({ ...agentFilters, barcode: value.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // avoid form submit if inside a <form>
                  onEnter((e.target as HTMLInputElement).value.trim());
                }
              }}
              onBlur={() => setFocus()}
              value={agentFilters.barcode}
              ref={barcodeBundleRef}
              className="w-full"
              id="barcode"
              placeholder="Please scan or type the barcode here..."
              inputClassName="w-full"
            />
            <Button
              icon="pi pi-search"
              label="Search"
              outlined
              severity="info"
              onClick={() => onEnter(agentFilters.barcode ?? '')}
              tooltipOptions={{ position: 'left' }}
              tooltip="Search"
            ></Button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            This is just a test page, and all barcodes scanned here will not be recorded in the system, although you can see the exact results that
            the agent receives.
          </p>
          <hr />
          <label className="block mb-1 font-semibold">Response from the server:</label>
          {logState == 'error' && <h5 className="text-red-500">{message}</h5>}
          {logState == 'success' && <h5 className="text-green-500">{message}</h5>}
          {isLogging && (
            <div className="col-12 flex justify-content-center align-items-center">
              <ProgressSpinner style={{ width: '50px', height: '50px' }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AgentTestPage;
