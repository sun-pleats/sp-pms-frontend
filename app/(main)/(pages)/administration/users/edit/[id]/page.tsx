'use client';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import { User, UserForm } from '@/app/types/users';
import { useRouter } from 'next/navigation';
import { useUserPage } from '../../hooks/useUserPage';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import FormUser from '@/app/components/users/FormUser';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageCard from '@/app/components/page-card/component';
import React, { useContext, useCallback, useEffect, useState } from 'react';
import UserService from '@/app/services/UserService';

interface EditUserPageProps {
  params?: { id: any };
}

const EditUserPage = ({ params }: EditUserPageProps) => {
  const router = useRouter();
  const { updateUser, isSaveLoading } = useUserPage();
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const [user, setUser] = useState<UserForm | undefined>();

  const userTypes: SelectItem[] = [
    { label: 'Operator', value: 'operator' },
    { label: 'Administrator', value: 'administrator' },
    { label: 'Administrator', value: 'manager' }
  ];

  const getUser = useCallback(async () => {
    setUser((await UserService.getUser(params?.id)).data as UserForm);
  }, [params?.id]);

  useEffect(() => {
    if (params?.id) {
      getUser();
    }
  }, [params?.id, getUser]);
    
  const handleSubmit = async (data: User) => {
    try {
      await updateUser(params?.id as string, data);
      showSuccess('User successfully created.');
      setTimeout(() => {
        router.push(ROUTES.USERS.INDEX);
      }, 2000);
    } catch (error: any) {
      showApiError(error, 'Failed to save user.');
    }
    console.log('handleSubmit', data);
  };

  return (
    <div className="grid justify-content-center">
      <div className="col-12 lg:col-6">
        <PageCard title="Edit User" toolbar={<PageAction actionBack={() => router.push(ROUTES.USERS.INDEX)} actions={[PageActions.BACK]} />}>
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormUser value={user} userTypes={userTypes} onSubmit={handleSubmit}>
                  <div className="flex">
                    <div className="ml-auto">
                      <FormAction loadingSave={isSaveLoading} actionCancel={() => router.push(ROUTES.USERS.INDEX)} actions={[FormActions.CANCEL, FormActions.UPDATE]} />
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

export default EditUserPage;
