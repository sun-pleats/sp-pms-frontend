'use client';
import React, { useContext } from 'react';
import PageCard from '@/app/components/page-card/component';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import { useRouter } from 'next/navigation';
import FormUser from '@/app/components/users/FormUser';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import UserService from '@/app/services/UserService';
import { LayoutContext, LayoutProvider } from '@/layout/context/layoutcontext';
import type { AxiosError } from 'axios';
import { useUserPage } from '../hooks/useUserPage';

const CreateUserPage = () => {
  const router = useRouter();
  const userTypes: SelectItem[] = [
    { label: 'Operator', value: 'operator' },
    { label: 'Administrator', value: 'administrator' },
    { label: 'Manager', value: 'manager' }
  ];

  
  const { saveUser, isSaveLoading } = useUserPage();
  const { showApiError, showSuccess } = useContext(LayoutContext);

  const handleSubmit = async (payload: any) => {
    try {
      await saveUser(payload);
      showSuccess('User successfully created.');
      setTimeout(() => {
        router.push(ROUTES.USERS.INDEX);
      }, 2000);
    } catch (error: any) {
      showApiError(error, 'Failed to create user');
    }
  };

  return (
    <div className="grid justify-content-center">
      <div className="col-12 lg:col-6">
        <PageCard title="Create User" toolbar={<PageAction actionBack={() => router.push(ROUTES.USERS.INDEX)} actions={[PageActions.BACK]} />}>
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormUser userTypes={userTypes} onSubmit={handleSubmit}>
                  <div className="flex">
                    <div className="ml-auto">
                      <FormAction loadingSave={isSaveLoading} actionCancel={() => router.push(ROUTES.USERS.INDEX)} actions={[FormActions.CANCEL, FormActions.SAVE]} />
                    </div>
                  </div>
                </FormUser>
              </div>
            </div>
          </div>
        </PageCard>
      </div>
    </div>
  );
};

export default CreateUserPage;
