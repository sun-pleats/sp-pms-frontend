'use client';
import React, { useContext } from 'react';
import PageCard from '@/app/components/page-card/component';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import { ROUTES } from '@/app/constants/routes';
import { useRouter } from 'next/navigation';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { DefaultFormData } from '@/app/types/form';
import { useDepartmentPage } from '../hooks/useDepartmentPage';
import FormDepartment from '@/app/components/departments/FormDepartment';

const CreateDepartmentPage = () => {
  const router = useRouter();

  const { saveDepartment, isSaveLoading } = useDepartmentPage();
  const { showApiError, showSuccess } = useContext(LayoutContext);

  const handleSubmit = async (data: DefaultFormData) => {
    try {
      await saveDepartment(data);
      showSuccess('Department successfully created.');
      setTimeout(() => {
        router.push(ROUTES.DEPARTMENTS.INDEX);
      }, 2000);
    } catch (error: any) {
      showApiError(error, 'Failed to save department.');
    }
  };

  return (
    <div className="grid justify-content-center">
      <div className="col-12 lg:col-6">
        <PageCard
          title="Create Department"
          toolbar={<PageAction actionBack={() => router.push(ROUTES.DEPARTMENTS.INDEX)} actions={[PageActions.BACK]} />}
        >
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormDepartment onSubmit={handleSubmit}>
                  <div className="flex">
                    <div className="ml-auto">
                      <FormAction
                        loadingSave={isSaveLoading}
                        actionCancel={() => router.push(ROUTES.DEPARTMENTS.INDEX)}
                        actions={[FormActions.CANCEL, FormActions.SAVE]}
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

export default CreateDepartmentPage;
