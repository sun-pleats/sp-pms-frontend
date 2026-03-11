import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const LoginPage = dynamic(() => import('./LoginPage').then((m) => m.default));

const Page = () => {
  return (
    <Suspense fallback={null}>
      <LoginPage></LoginPage>
    </Suspense>
  );
};

export default Page;
