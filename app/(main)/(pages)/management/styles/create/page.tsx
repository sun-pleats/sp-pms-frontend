'use client';
import { DefaultFormData } from '@/app/types/form';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import { useRouter } from 'next/navigation';
import { useStylePage } from '../hooks/useStylePage';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import FormStyle from '@/app/components/style/FormStyle';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageCard from '@/app/components/page-card/component';
import React, { useContext, useEffect, useState } from 'react';
import useUtilityData from '@/app/hooks/useUtilityData';

const CreateStylePage = () => {
  const router = useRouter();
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const { saveStyle, isSaveLoading } = useStylePage();
  const [buyers, setBuyers] = useState<SelectItem[]>([]);
  const [sections, setSections] = useState<SelectItem[]>([]);
  const { isBuyerLoading, fetchBuyerOptions, fetchSectionOptions } = useUtilityData();

  useEffect(() => {
    initData();
  }, [])

  const initData = async () => {
    fetchBuyerOptions().then((data: SelectItem[]) => setBuyers(data));
    fetchSectionOptions().then((data: SelectItem[]) => setSections(data));
  }

  const styleOptions: SelectItem[] = [
    { label: 'Type 1', value: 'type-1' }
  ];

  const handleSubmit = async (e: DefaultFormData) => {
    try {
      await saveStyle(e);
      showSuccess("Style successfully saved.");
      setTimeout(() => {
        router.push(ROUTES.STYLES_INDEX);
      }, 2000);
    } catch (error: any) {
      showApiError(error, 'Failed to create style.');
    }
  }

  return (
    <PageCard
      title='Create Style'
      toolbar={
        <PageAction
          actionBack={() => router.push(ROUTES.STYLES_INDEX)}
          actions={[PageActions.BACK]}
        />
      }
    >
      <div className='grid'>
        <div className='col-12'>
          <div className='p-fluid'>
            <FormStyle
              onSubmit={handleSubmit}
              styleOptions={styleOptions}
              loading={{ buyerField: isBuyerLoading }}
              buyerOptions={buyers}
              sectionOptions={sections}
            >
              <div className='grid mt-5'>
                <div className='ml-auto'>
                  <FormAction loadingSave={isSaveLoading} actionCancel={() => router.push(ROUTES.STYLES_INDEX)} actions={[FormActions.CANCEL, FormActions.SAVE]} />
                </div>
              </div>
            </FormStyle>
          </div>
        </div>
      </div>
    </PageCard>
  );
};

export default CreateStylePage;
