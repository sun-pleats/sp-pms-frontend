'use client';

import { ROUTES } from '@/app/constants/routes';
import { useProcessOffsetPage } from '../../hooks/useProcessOffsetPage';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import FormProcessOffset from '@/app/components/process-offset/FormProcessOffset';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageCard from '@/app/components/page-card/component';
import React from 'react';

interface EditProcessOffsetPageProps {
  params?: { id: any };
}

const EditProcessOffsetPage = ({ params }: EditProcessOffsetPageProps) => {
  const { isSaveLoading, isFetching, router, processOffset, updateProcessOffset } = useProcessOffsetPage(params?.id);
  return (
    <div className="grid justify-content-start">
      <div className="col-12 lg:col-6">
        <PageCard
          title="Edit Process Offset"
          toolbar={<PageAction actionBack={() => router.push(ROUTES.PROCESS_OFFSETS.INDEX)} actions={[PageActions.BACK]} />}
        >
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormProcessOffset value={processOffset} onSubmit={updateProcessOffset}>
                  <div className="flex mt-2">
                    <div className="ml-auto">
                      <FormAction
                        loadingUpdate={isSaveLoading || isFetching}
                        actionCancel={() => router.push(ROUTES.PROCESS_OFFSETS.INDEX)}
                        actions={[FormActions.CANCEL, FormActions.UPDATE]}
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

export default EditProcessOffsetPage;
