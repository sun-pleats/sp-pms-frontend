'use client';
import React, { useContext } from 'react';
import PageCard from '@/app/components/page-card/component';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import { ROUTES } from '@/app/constants/routes';
import { useRouter } from 'next/navigation';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import FormProcess from '@/app/components/processes/FormProcess';
import { useProcessPage } from '../hooks/useProcessPage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { DefaultFormData } from '@/app/types/form';

const CreateProcessPage = () => {
  const router = useRouter();

  const { saveProcess, isSaveLoading } = useProcessPage();
  const { showApiError, showSuccess } = useContext(LayoutContext);

  const handleSubmit = async (data: DefaultFormData) => {
    try {
      await saveProcess(data);
      showSuccess('Process offset successfully saved.');
      setTimeout(() => {
        router.push(ROUTES.PROCESS.INDEX);
      }, 2000);
    } catch (error: any) {
      showApiError(error, 'Failed to process offset.');
    }
  };

  return (
    <div className="grid justify-content-start">
      <div className="col-12 lg:col-6">
        <PageCard title="Create Process" toolbar={<PageAction actionBack={() => router.push(ROUTES.PROCESS.INDEX)} actions={[PageActions.BACK]} />}>
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormProcess onSubmit={handleSubmit}>
                  <div className="flex">
                    <div className="ml-auto">
                      <FormAction
                        loadingSave={isSaveLoading}
                        actionCancel={() => router.push(ROUTES.PROCESS_OFFSETS.INDEX)}
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
