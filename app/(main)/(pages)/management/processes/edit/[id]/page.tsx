/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { ProcessForm } from '@/app/types/process';
import { ProcessService } from '@/app/services/ProcessService';
import { ROUTES } from '@/app/constants/routes';
import { useProcessPage } from '../../hooks/useProcessPage';
import { useRouter } from 'next/navigation';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import FormProcess from '@/app/components/processes/FormProcess';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageCard from '@/app/components/page-card/component';
import React, { useContext, useCallback, useEffect, useState } from 'react';
import { isEmpty } from 'lodash';

interface EditProcessPageProps {
  params?: { id: any };
}

const EditProcessPage = ({ params }: EditProcessPageProps) => {
  const router = useRouter();
  const { updateProcess, isSaveLoading, getSuggestProcessCode, isSuggesting } = useProcessPage();
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const [process, setProcess] = useState<ProcessForm | undefined>();

  const getProcess = useCallback(async () => {
    const { data } = await ProcessService.getProcess(params?.id);
    setProcess(data as ProcessForm);
  }, [params?.id]);

  const handleSubmit = async (data: ProcessForm) => {
    try {
      await updateProcess(params?.id as string, data);
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

  useEffect(() => {
    if (params?.id) {
      getProcess();
    }
  }, [params?.id, getProcess]);

  return (
    <div className="grid justify-content-start">
      <div className="col-12 lg:col-6">
        <PageCard title="Edit Process" toolbar={<PageAction actionBack={() => router.push(ROUTES.PROCESS.INDEX)} actions={[PageActions.BACK]} />}>
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormProcess value={process} suggestLoading={isSuggesting} onSuggestClick={handleSuggestCode} onSubmit={handleSubmit}>
                  <div className="flex">
                    <div className="ml-auto">
                      <FormAction
                        loadingUpdate={isSaveLoading || !process}
                        actionCancel={() => router.push(ROUTES.PROCESS.INDEX)}
                        actions={[FormActions.CANCEL, FormActions.UPDATE]}
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

export default EditProcessPage;
