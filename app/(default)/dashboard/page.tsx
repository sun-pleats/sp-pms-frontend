'use client';

import './page.scss';
import React from 'react';
import DashboardTable from '@/app/components/dashboard/DashboardTable';
import { BuyerDashboard } from '@/app/types/buyers';

interface StyleDetail {
  name: string;
  value: string;
}

const buyers: BuyerDashboard[] = [
  {
    id: '1',
    name: 'Buyer 1',
    current_suply: 1200,
    target: 1500,
    actual: 1000,
    progress_rate: '50%',
    defects: 10,
    defects_rate: '10%',
    balance: 100,
    created_at: '',
    updated_at: ''
  },
  {
    id: '2',
    name: 'Buyer 2',
    current_suply: 1200,
    target: 0,
    actual: 0,
    progress_rate: '0%',
    defects: 10,
    defects_rate: '10%',
    balance: 0,
    created_at: '',
    updated_at: ''
  }
];

const LandingPage = () => {
  return (
    <div className="gradient-bg">
      <div className="w-full">
        <DashboardTable buyers={buyers} />
      </div>
    </div>
  );
};

export default LandingPage;
