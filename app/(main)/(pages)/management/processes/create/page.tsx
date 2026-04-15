'use client';
import { DefaultFormData } from '@/app/types/form';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ROUTES } from '@/app/constants/routes';
import { useProcessPage } from '../hooks/useProcessPage';
import { useRouter } from 'next/navigation';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import FormProcess from '@/app/components/processes/FormProcess';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageCard from '@/app/components/page-card/component';
import React, { useContext, useState } from 'react';
import { isEmpty } from 'lodash';
import { ProcessForm } from '@/app/types/process';

const CreateProcessPage = () => {
  const router = useRouter();

  const { saveProcess, isSaveLoading, getSuggestProcessCode, isSuggesting } = useProcessPage();
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const [process, setProcess] = useState<ProcessForm | undefined>();

  const handleSubmit = async (data: DefaultFormData) => {
    try {
      await saveProcess(data);
      showSuccess('Process successfully saved.');
      setTimeout(() => {
        router.push(ROUTES.PROCESS.INDEX);
      }, 2000);
    } catch (error: any) {
      showApiError(error, 'Failed to save process.');
    }
  };
  const handleSuggestCode = async (process: ProcessForm) => {
    try {
      if (isEmpty(process.name)) return;

      const { data } = await getSuggestProcessCode(process.name);

      setProcess({
        ...process,
        code: data.code
      } as ProcessForm);
    } catch (error: any) {
      showApiError(error, 'Failed to save process.');
    }
  };

  return (
    <div className="grid justify-content-start">
      <div className="col-12 lg:col-6">
        <PageCard title="Create Process" toolbar={<PageAction actionBack={() => router.push(ROUTES.PROCESS.INDEX)} actions={[PageActions.BACK]} />}>
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormProcess value={process} suggestLoading={isSuggesting} onSubmit={handleSubmit} onSuggestClick={handleSuggestCode}>
                  <div className="flex">
                    <div className="ml-auto">
                      <FormAction
                        loadingSave={isSaveLoading}
                        actionCancel={() => router.push(ROUTES.PROCESS.INDEX)}
                        actions={[FormActions.CANCEL, FormActions.SAVE]}
                      />
                    </div>
                  </div>
                </FormProcess>
              </div>
            </div>
          </div>
        </PageCard>
      </div>
    </div>
  );
};

export default CreateProcessPage;
