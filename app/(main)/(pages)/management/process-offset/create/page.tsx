'use client';
import React, { useContext } from 'react';
import PageCard from '@/app/components/page-card/component';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import { ROUTES } from '@/app/constants/routes';
import { useRouter } from 'next/navigation';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import FormProcessOffset from '@/app/components/process-offset/FormProcessOffset';
import { useProcessOffsetPage } from '../hooks/useProcessOffsetPage';

const CreateProcessOffsetPage = () => {
  const router = useRouter();
  const { saveProcessOffset, isSaveLoading } = useProcessOffsetPage();

  return (
    <div className="grid justify-content-start">
      <div className="col-12 lg:col-6">
        <PageCard
          title="Create Process Offset"
          toolbar={<PageAction actionBack={() => router.push(ROUTES.PROCESS_OFFSETS.INDEX)} actions={[PageActions.BACK]} />}
        >
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormProcessOffset onSubmit={saveProcessOffset}>
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
