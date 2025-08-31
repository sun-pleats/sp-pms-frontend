'use client';
import { DepartmentForm } from '@/app/types/department';
import { DepartmentService } from '@/app/services/DepartmentService';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import { useRouter } from 'next/navigation';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import FormDepartment from '@/app/components/departments/FormDepartment';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageCard from '@/app/components/page-card/component';
import React, { useContext, useCallback, useEffect, useState } from 'react';
import { useDepartmentPage } from '../../hooks/useDepartmentPage';

interface EditDepartmentPageProps {
  params?: { id: any };
}

const EditDepartmentPage = ({ params }: EditDepartmentPageProps) => {
  const router = useRouter();
  const { updateDepartment, isSaveLoading } = useDepartmentPage();
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const [department, setDepartment] = useState<DepartmentForm | undefined>();

  const getDepartment = useCallback(async () => {
    setDepartment((await DepartmentService.getDepartment(params?.id)).data as DepartmentForm);
  }, [params?.id]);

  useEffect(() => {
    if (params?.id) {
      getDepartment();
    }
  }, [params?.id, getDepartment]);
  
  const handleSubmit = async (data: DepartmentForm) => {
    try {
      await updateDepartment(params?.id as string, data);
      showSuccess('Department successfully created.');
    } catch (error: any) {
      showApiError(error, 'Failed to save department.');
    }
    console.log('handleSubmit', data);
  };

  return (
    <div className="grid">
      <div className="col-6">
        <PageCard
          title="Edit Department"
          toolbar={<PageAction actionBack={() => router.push(ROUTES.DEPARTMENTS.INDEX)} actions={[PageActions.BACK]} />}
        >
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormDepartment value={department} onSubmit={handleSubmit}>
                  <FormAction  loadingSave={isSaveLoading}  actionCancel={() => router.push(ROUTES.DEPARTMENTS.INDEX)} actions={[FormActions.CANCEL, FormActions.UPDATE]} />
                </FormDepartment>
              </div>
            </div>
          </div>
        </PageCard>
      </div>
    </div>
  );
};

export default EditDepartmentPage;
