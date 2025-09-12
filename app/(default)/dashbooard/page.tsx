'use client';

import { Button } from 'primereact/button';
import { formatDateTime } from '@/app/utils';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { ListBox } from 'primereact/listbox';
import { Skeleton } from 'primereact/skeleton';
import { useRouter } from 'next/navigation';
import Barcode from '@/app/components/barcode/Barcode';
import FormDropdown from '@/app/components/form/dropdown/component';
import FormInputText from '@/app/components/form/input-text/component';
import Link from 'next/link';
import Modal from '@/app/components/modal/component';
import React, { useContext, useEffect, useRef, useState } from 'react';
import useKiosk from './hooks/useDashboard';
import useUtilityData from '@/app/hooks/useUtilityData';
import Dashboard from '@/app/(main)/page';
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
    updated_at: '',
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
    updated_at: '',
  }
];

const LandingPage = () => {
  return (
    <div className='w-full'>
      <DashboardTable buyers={buyers} />
    </div>
  );
};

export default LandingPage;
