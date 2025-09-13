'use client';

import React, { useCallback, useEffect, useState } from 'react';
import PageCard from '@/app/components/page-card/component';
import { SelectItem } from 'primereact/selectitem';
import FormStyle from '@/app/components/style/FormStyle';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import { useRouter } from 'next/navigation';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import { ROUTES } from '@/app/constants/routes';
import { useStylePage } from '../../hooks/useStylePage';
import useUtilityData from '@/app/hooks/useUtilityData';
import { DefaultFormData } from '@/app/types/form';
import { StyleService } from '@/app/services/StyleService';

interface EditStylePageProps {
  params?: { id: any };
}

const EditStylePage = ({ params }: EditStylePageProps) => {
  const router = useRouter();
  const { isSaveLoading } = useStylePage();
  const [buyers, setBuyers] = useState<SelectItem[]>([]);
  const { isBuyerLoading, fetchBuyerOptions } = useUtilityData();
  const [style, setStyle] = useState<DefaultFormData | undefined>();
  
  useEffect(() => {
    initData();
  }, []);
  
  const initData = async () => {
    fetchBuyerOptions().then((data: SelectItem[]) => setBuyers(data));
  }

  const styleOptions: SelectItem[] = [
    { label: 'Type 1', value: 'type-1' }
  ];
  
  const getStyle = useCallback(async () => {
    setStyle((await StyleService.getStyle(params?.id)).data as DefaultFormData);
  }, [params?.id]);
  
  useEffect(() => {
    if (params?.id) {
      getStyle();
    }
  }, [params?.id, getStyle]);

  const handleSubmit = async (e: DefaultFormData) => {
    // try {
    //   await saveStyle(e);
    //   showSuccess("Style successfully updated.");
    //   setTimeout(() => {
    //     router.push(ROUTES.STYLES_INDEX);
    //   }, 2000);
    // } catch (error: any) {
    //   showApiError(error, 'Failed to update style.');
    // }
  }

  return (
    <PageCard
      title='Edit Style'
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
              value={style}
              styleOptions={styleOptions}
              loading={{ buyerField: isBuyerLoading }}
              buyerOptions={buyers}
            >
              <div className='grid mt-5'>
                <div className='ml-auto'>
                  <FormAction 
                    loadingSave={isSaveLoading} 
                    actionCancel={() => router.push(ROUTES.USERS.INDEX)} 
                    actions={[FormActions.CANCEL, FormActions.SAVE]} />
                </div>
              </div>
            </FormStyle>
          </div>
        </div>
      </div>
    </PageCard>
  );
};

export default EditStylePage;
