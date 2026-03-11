import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const AgentTestPage = dynamic(() => import('./AgentTestPage').then((m) => m.default), { ssr: false });

const Page = () => {
  return (
    <Suspense fallback={null}>
      <AgentTestPage></AgentTestPage>
    </Suspense>
  );
};

export default Page;
