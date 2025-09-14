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
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const [department, setDepartment] = useState<DepartmentForm | undefined>();

  const getDepartment = useCallback(async () => {
    try {
      setIsFetching(true);
      setDepartment((await DepartmentService.getDepartment(params?.id)).data as DepartmentForm);
    } catch (error) {
      showApiError(error, 'Fetching error');
    } finally {
      setIsFetching(false);
    }
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
      setTimeout(() => {
        router.push(ROUTES.DEPARTMENTS.INDEX);
      }, 2000);
    } catch (error: any) {
      showApiError(error, 'Failed to save department.');
    }
  };

  return (
    <div className="grid justify-content-start">
      <div className="col-12 lg:col-6">
        <PageCard
          title="Edit Department"
          toolbar={<PageAction actionBack={() => router.push(ROUTES.DEPARTMENTS.INDEX)} actions={[PageActions.BACK]} />}
        >
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormDepartment value={department} onSubmit={handleSubmit}>
                  <div className="flex">
                    <div className="ml-auto">
                      <FormAction
                        loadingUpdate={isSaveLoading || isFetching}
                        actionCancel={() => router.push(ROUTES.DEPARTMENTS.INDEX)}
                        actions={[FormActions.CANCEL, FormActions.UPDATE]}
                      />
                    </div>
                  </div>
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
