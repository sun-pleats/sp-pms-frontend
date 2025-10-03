'use client';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ROUTES } from '@/app/constants/routes';
import { SectionForm } from '@/app/types/section';
import { SectionService } from '@/app/services/SectionService';
import { SelectItem } from 'primereact/selectitem';
import { useRouter } from 'next/navigation';
import { useSectionPage } from '../../hooks/useSectionPage';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import FormSection from '@/app/components/sections/FormSection';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageCard from '@/app/components/page-card/component';
import React, { useContext, useCallback, useEffect, useState } from 'react';
import useUtilityData from '@/app/hooks/useUtilityData';

interface EditSectionPageProps {
  params?: { id: any };
}

const EditSectionPage = ({ params }: EditSectionPageProps) => {
  const router = useRouter();
  const [departmentOption, setDepartmentOption] = useState<SelectItem[]>([]);
  const { updateSection, isSaveLoading } = useSectionPage();
  const [section, setSection] = useState<SectionForm | undefined>();
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const { fetchDepartmentOptions, isDepartmentLoading } = useUtilityData();

  const getSection = useCallback(async () => {
    const response = await SectionService.getSection(params?.id);
    setSection(response.data as SectionForm);
  }, [params?.id]);

  const handleSubmit = async (data: SectionForm) => {
    try {
      await updateSection(params?.id as string, data);
      showSuccess('Section successfully saved.');
      setTimeout(() => {
        router.push(ROUTES.SECTION.INDEX);
      }, 2000);
    } catch (error: any) {
      showApiError(error, 'Failed to process section.');
    }
  };

  const initData = async () => {
    setDepartmentOption(await fetchDepartmentOptions());
  };

  useEffect(() => {
    if (params?.id) {
      getSection();
    }
  }, [params?.id, getSection]);

  useEffect(() => {
    initData();
  }, []);

  return (
    <div className="grid justify-content-start">
      <div className="col-12 lg:col-6">
        <PageCard title="Edit Section" toolbar={<PageAction actionBack={() => router.push(ROUTES.SECTION.INDEX)} actions={[PageActions.BACK]} />}>
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormSection value={section} onSubmit={handleSubmit} loading={{ deparmentField: isDepartmentLoading }} departments={departmentOption}>
                  <div className="flex mt-2">
                    <div className="ml-auto">
                      <FormAction
                        loadingUpdate={isSaveLoading || isDepartmentLoading}
                        actionCancel={() => router.push(ROUTES.SECTION.INDEX)}
                        actions={[FormActions.CANCEL, FormActions.UPDATE]}
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

export default EditSectionPage;
