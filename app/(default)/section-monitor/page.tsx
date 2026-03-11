import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const SectionMonitorPage = dynamic(() => import('./SectionMonitorPage').then((m) => m.default), { ssr: false });

const Page = () => {
  return (
    <Suspense fallback={null}>
      <SectionMonitorPage></SectionMonitorPage>
    </Suspense>
  );
};

export default Page;
