'use client';

import '@xyflow/react/dist/style.css';
import { AutoCompleteSelectEvent } from 'primereact/autocomplete';
import { BundleMovementRecord } from '@/app/types/styles';
import { Option } from '@/app/types';
import { ROUTES } from '@/app/constants/routes';
import { useState } from 'react';
import BundleEntryFlow from '@/app/components/bundle/BundleEntryFlow';
import PageTile from '@/app/components/page-title/component';
import RemoteStyleBundleDropdown from '@/app/components/remote/style-bundle/component';

const StyleFlowPage = () => {
  const [selectedStyleNumber, setSelectedStyleNumber] = useState<Option | null>(null);
  const handleSelectedStyle = (option: AutoCompleteSelectEvent<Option>) => {
    //fetchPlannedFabics(option.value?.value?.toString());
  };

  const sample: BundleMovementRecord[] = [
    {
      id: 'm1',
      productId: 'P-1001',
      department: 'Cutting',
      entryTime: '2025-09-18T08:00:00+08:00',
      exitTime: '2025-09-18T09:30:00+08:00',
      user: 'Anna'
    },
    {
      id: 'm2',
      productId: 'P-1001',
      department: 'Sewing',
      entryTime: '2025-09-18T09:45:00+08:00',
      exitTime: '2025-09-18T13:10:00+08:00',
      user: 'Ben'
    },
    {
      id: 'm3',
      productId: 'P-1001',
      department: 'QA',
      entryTime: '2025-09-18T13:30:00+08:00',
      exitTime: '2025-09-18T14:05:00+08:00',
      user: 'Ching'
    },
    {
      id: 'm4',
      productId: 'P-1001',
      department: 'Packing',
      entryTime: '2025-09-18T14:20:00+08:00',
      exitTime: '2025-09-18T15:00:00+08:00',
      user: 'Dax'
    }
  ];

  return (
    <>
      <PageTile title="Bundle Flow" icon="pi pi-fw pi-share-alt" url={ROUTES.BUNDLE_FLOW.INDEX} />
      <RemoteStyleBundleDropdown value={selectedStyleNumber} onSelect={handleSelectedStyle} onChange={(option) => setSelectedStyleNumber(option)} />
      <p className="mt-2">Visualizes how a bundle moves across departments, showing entry/exit times, user, and duration for each step.</p>
      <BundleEntryFlow records={sample} />
    </>
  );
};

export default StyleFlowPage;
