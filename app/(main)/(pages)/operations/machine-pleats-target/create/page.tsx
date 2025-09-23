'use client';
import React from 'react';
import PageCard from '@/app/components/page-card/component';
import { SelectItem } from 'primereact/selectitem';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/constants/routes';

const CreateBundlePage = () => {
  const router = useRouter();

  const bundleOptions: SelectItem[] = [{ label: 'Type 1', value: 'type-1' }];
  return (
    <div className="grid">
      <div className="col-6">
        <PageCard title="Create Bundle" toolbar={<PageAction actionBack={() => router.push(ROUTES.BUNDLES.INDEX)} actions={[PageActions.BACK]} />}>
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid"></div>
            </div>
          </div>
        </PageCard>
      </div>
    </div>
  );
};

export default CreateBundlePage;
