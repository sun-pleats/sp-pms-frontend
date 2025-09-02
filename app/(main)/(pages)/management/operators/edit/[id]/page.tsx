'use client';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { OperatorForm } from '@/app/types/operator';
import { OperatorService } from '@/app/services/OperatorService';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import { useOperatorPage } from '../../hooks/useOperatorPage';
import { useRouter } from 'next/navigation';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import FormOperator from '@/app/components/operators/FormOperator';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageCard from '@/app/components/page-card/component';
import React, { useContext, useCallback, useEffect, useState } from 'react';
import useUtilityData from '@/app/hooks/useUtilityData';

interface EditOperatorPageProps {
  params?: { id: any };
}

const EditOperatorPage = ({ params }: EditOperatorPageProps) => {
  const router = useRouter();
  const [lines, setLines] = useState<SelectItem[]>([]);
  const [processes, setProcesses] = useState<SelectItem[]>([]);
  const { updateOperator, isSaveLoading } = useOperatorPage();
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const [operator, setOperator] = useState<OperatorForm | undefined>();

  const { isSectionLoading, fetchSectionOptions, isProcessLoading, fetchProcessOptions } = useUtilityData();

   useEffect(() => {
     initData();
   }, []);
 
   const initData = () => {
     fetchSectionOptions().then((data: SelectItem[]) => setLines(data));
     fetchProcessOptions().then((data: SelectItem[]) => setProcesses(data));
   };

  const getOperator = useCallback(async () => {
    setOperator((await OperatorService.getOperator(params?.id)).data as OperatorForm);
  }, [params?.id]);

  useEffect(() => {
    if (params?.id) {
      getOperator();
    }
  }, [params?.id, getOperator]);
  
  const handleSubmit = async (data: OperatorForm) => {
    try {
      await updateOperator(params?.id as string, data);
      showSuccess('Operator successfully created.');
      setTimeout(() => {
        router.push(ROUTES.OPERATORS.INDEX);
      }, 2000);
    } catch (error: any) {
      showApiError(error, 'Failed to save operator.');
    }
    console.log('handleSubmit', data);
  };

  return (
    <div className="grid">
      <div className="col-6">
        <PageCard title="Edit Operator" toolbar={<PageAction actionBack={() => router.push(ROUTES.OPERATORS.INDEX)} actions={[PageActions.BACK]} />}>
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormOperator 
                  processesOptions={processes} 
                  lines={lines} 
                  value={operator} 
                  onSubmit={handleSubmit}
                >
                  <div className="flex mt-2">
                    <div className="ml-auto">
                      <FormAction loadingSave={isSaveLoading} actionCancel={() => router.push(ROUTES.OPERATORS.INDEX)} actions={[FormActions.CANCEL, FormActions.UPDATE]} />
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

export default EditOperatorPage;
