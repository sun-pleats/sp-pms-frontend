'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import { useRouter } from 'next/navigation';
import { useSectionPage } from '../hooks/useSectionPage';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import FormSection from '@/app/components/sections/FormSection';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageCard from '@/app/components/page-card/component';
import React, { useContext, useEffect, useState } from 'react';
import useUtilityData from '@/app/hooks/useUtilityData';
import { SectionForm } from '@/app/types/section';

const CreateSectionPage = () => {
  const router = useRouter();

  const [departmentOption, setDepartmentOption] = useState<SelectItem[]>([]);
  const { saveSection, isSaveLoading } = useSectionPage();
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const { fetchDepartmentOptions, isDepartmentLoading } = useUtilityData();

  const handleSubmit = async (data: SectionForm) => {
    try {
      await saveSection(data);
      showSuccess('Section offset successfully created.');
      setTimeout(() => {
        router.push(ROUTES.SECTION.INDEX);
      }, 2000);
    } catch (error: any) {
      showApiError(error, 'Failed to process offset.');
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setDepartmentOption(await fetchDepartmentOptions());
  };

  return (
    <div className="grid justify-content-start">
      <div className="col-12 lg:col-6">
        <PageCard title="Create Section" toolbar={<PageAction actionBack={() => router.push(ROUTES.SECTION.INDEX)} actions={[PageActions.BACK]} />}>
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormSection onSubmit={handleSubmit} loading={{ deparmentField: isDepartmentLoading }} departments={departmentOption}>
                  <div className="flex mt-2">
                    <div className="ml-auto">
                      <FormAction
                        loadingSave={isSaveLoading}
                        actionCancel={() => router.push(ROUTES.SECTION.INDEX)}
                        actions={[FormActions.CANCEL, FormActions.SAVE]}
                      />
                    </div>
                  </div>
                </FormSection>
              </div>
            </div>
          </div>
        </PageCard>
      </div>
    </div>
  );
};

export default CreateSectionPage;
