'use client';
import { DefaultFormData } from '@/app/types/form';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import { useOperatorPage } from '../hooks/useOperatorPage';
import { useRouter } from 'next/navigation';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import FormOperator from '@/app/components/operators/FormOperator';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageCard from '@/app/components/page-card/component';
import React, { useContext, useEffect, useState } from 'react';
import useUtilityData from '@/app/hooks/useUtilityData';

const CreateOperatorPage = () => {
  const router = useRouter();

  const [lines, setLines] = useState<SelectItem[]>([]);
  const [processes, setProcesses] = useState<SelectItem[]>([]);
  const { showApiError, showSuccess } = useContext(LayoutContext);

  const { isSectionLoading, fetchSectionOptions, isProcessLoading, fetchProcessOptions } = useUtilityData();
  const { saveOperator, isSaveLoading } = useOperatorPage();

  useEffect(() => {
    initData();
  }, []);

  const initData = () => {
    fetchSectionOptions().then((data: SelectItem[]) => setLines(data));
    fetchProcessOptions().then((data: SelectItem[]) => setProcesses(data));
  };

  const handleSubmit = async (data: DefaultFormData) => {
    try {
      await saveOperator(data);
      showSuccess('Operator successfully created.');
      setTimeout(() => {
        router.push(ROUTES.OPERATORS.INDEX);
      }, 2000);
    } catch (error: any) {
      showApiError(error, 'Failed to operator.');
    }
  };

  return (
    <div className="grid justify-content-start">
      <div className="col-12 lg:col-6">
        <PageCard
          title="Create Operator"
          toolbar={<PageAction actionBack={() => router.push(ROUTES.OPERATORS.INDEX)} actions={[PageActions.BACK]} />}
        >
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormOperator
                  onSubmit={handleSubmit}
                  lines={lines}
                  loading={{ lineField: isSectionLoading, processField: isProcessLoading }}
                  processesOptions={processes}
                >
                  <div className="flex mt-2">
                    <div className="ml-auto">
                      <FormAction
                        loadingSave={isSaveLoading}
                        actionCancel={() => router.push(ROUTES.OPERATORS.INDEX)}
                        actions={[FormActions.CANCEL, FormActions.SAVE]}
                      />
                    </div>
                  </div>
                </FormOperator>
              </div>
            </div>
          </div>
        </PageCard>
      </div>
    </div>
  );
};

export default CreateOperatorPage;
