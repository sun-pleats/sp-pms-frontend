'use client';
import React, { useContext } from 'react';
import PageCard from '@/app/components/page-card/component';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import { ROUTES } from '@/app/constants/routes';
import { useRouter } from 'next/navigation';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import FormProcessOffset from '@/app/components/process-offset/FormProcessOffset';
import { useProcessOffsetPage } from '../hooks/useProcessOffsetPage';
import { DefaultFormData } from '@/app/types/form';
import { LayoutContext } from '@/layout/context/layoutcontext';

const CreateProcessOffsetPage = () => {
  const router = useRouter();
  const { saveProcessOffset, isSaveLoading } = useProcessOffsetPage();
  const { showApiError, showSuccess } = useContext(LayoutContext);

  const handleSubmit = async (data: DefaultFormData) => {
    try {
      await saveProcessOffset(data);
      showSuccess('Process offset successfully created.');
      setTimeout(() => {
        router.push(ROUTES.PROCESS_OFFSETS.INDEX);
      }, 2000);
    } catch (error: any) {
      showApiError(error, 'Failed to process offset.');
    }
  };

  return (
    <div className="grid justify-content-center">
      <div className="col-12 lg:col-6">
        <PageCard
          title="Create Process Offset"
          toolbar={<PageAction actionBack={() => router.push(ROUTES.PROCESS_OFFSETS.INDEX)} actions={[PageActions.BACK]} />}
        >
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormProcessOffset onSubmit={handleSubmit}>
                  <div className="flex mt-2">
                    <div className="ml-auto">
                      <FormAction
                        loadingSave={isSaveLoading}
                        actionCancel={() => router.push(ROUTES.PROCESS_OFFSETS.INDEX)}
                        actions={[FormActions.CANCEL, FormActions.SAVE]}
                      />
                    </div>
                  </div>
                </FormProcessOffset>
              </div>
            </div>
          </div>
        </PageCard>
      </div>
    </div>
  );
};

export default CreateProcessOffsetPage;
