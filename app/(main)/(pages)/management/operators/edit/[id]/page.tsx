import React from 'react';
import EditOperatorPage from './edit-operator-page';

interface PageProps {
  params: { id: string };
}

const Page = ({ params }: PageProps) => {
  return <EditOperatorPage params={params} />;
};

export default Page;
