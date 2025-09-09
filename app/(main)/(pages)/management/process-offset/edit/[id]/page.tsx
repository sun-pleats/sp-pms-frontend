'use client';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ProcessOffsetForm } from '@/app/types/process-offset';
import { ProcessOffsetService } from '@/app/services/ProcessOffsetService';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import { useProcessOffsetPage } from '../../hooks/useProcessOffsetPage';
import { useRouter } from 'next/navigation';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import FormProcessOffset from '@/app/components/process-offset/FormProcessOffset';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageCard from '@/app/components/page-card/component';
import React, { useContext, useCallback, useEffect, useState } from 'react';

interface EditProcessOffsetPageProps {
  params?: { id: any };
}

const EditProcessOffsetPage = ({ params }: EditProcessOffsetPageProps) => {
  const router = useRouter();
  const { updateProcessOffset, isSaveLoading } = useProcessOffsetPage();
  const [processOffset, setProcessOffset] = useState<ProcessOffsetForm | undefined>();
  const { showApiError, showSuccess } = useContext(LayoutContext);

  const getProcessOffset = useCallback(async () => {
    setProcessOffset((await ProcessOffsetService.getProcessOffset(params?.id)).data as ProcessOffsetForm);
  }, [params?.id]);

  const handleSubmit = async (data: ProcessOffsetForm) => {
    try {
      await updateProcessOffset(params?.id as string, data);
      showSuccess('Process offset successfully created.');
      setTimeout(() => {
        router.push(ROUTES.PROCESS_OFFSETS.INDEX);
      }, 2000);
    } catch (error: any) {
      showApiError(error, 'Failed to save process offset.');
    }
    console.log('handleSubmit', data);
  };

  useEffect(() => {
    if (params?.id) {
      getProcessOffset();
    }
  }, [params?.id, getProcessOffset]);

  return (
    <div className="grid justify-content-start">
      <div className="col-12 lg:col-6">
        <PageCard
          title="Edit ProcessOffset"
          toolbar={<PageAction actionBack={() => router.push(ROUTES.PROCESS_OFFSETS.INDEX)} actions={[PageActions.BACK]} />}
        >
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormProcessOffset value={processOffset} onSubmit={handleSubmit}>
                  <div className="flex mt-2">
                    <div className="ml-auto">
                      <FormAction
                        loadingSave={isSaveLoading}
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
