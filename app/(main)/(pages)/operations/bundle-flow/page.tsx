'use client';

import { AutoCompleteSelectEvent } from 'primereact/autocomplete';
import { BundleMovementRecord } from '@/app/types/styles';
import { Option } from '@/app/types';
import { ROUTES } from '@/app/constants/routes';
import { useContext, useState } from 'react';
import BundleEntryFlow from '@/app/components/bundle/BundleEntryFlow';
import PageTile from '@/app/components/page-title/component';
import RemoteStyleBundleDropdown from '@/app/components/remote/style-bundle/component';
import { StyleBundleService } from '@/app/services/StyleBundleService';
import { LayoutContext } from '@/layout/context/layoutcontext';

const StyleFlowPage = () => {
  const [selectedStyleNumber, setSelectedStyleNumber] = useState<Option | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [bundleMovement, setBundleMovement] = useState<BundleMovementRecord[]>([]);
  const handleSelectedStyle = (option: AutoCompleteSelectEvent<Option>) => {
    fetchBundleFlow(option.value?.value?.toString());
  };

  const { showApiError } = useContext(LayoutContext);

  const fetchBundleFlow = async (id: any) => {
    try {
      setIsFetching(true);
      const { data } = await StyleBundleService.getBundleFlow(id);
      setBundleMovement(
        data.map((r) => ({
          id: r.id?.toString() ?? '',
          department: r.department_name ?? '',
          entryTime: r.entry_time ?? '',
          exitTime: r.exit_time ?? '',
          user: r.entry_by_name ?? ''
        }))
      );
    } catch (error) {
      showApiError(error, 'Error fetching flow');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <PageTile title="Bundle Flow" icon="pi pi-fw pi-share-alt" url={ROUTES.BUNDLE_FLOW.INDEX} />
      <RemoteStyleBundleDropdown value={selectedStyleNumber} onSelect={handleSelectedStyle} onChange={(option) => setSelectedStyleNumber(option)} />
      <p className="mt-2">Visualizes how a bundle moves across departments, showing entry/exit times, user, and duration for each step.</p>
      <BundleEntryFlow loading={isFetching} records={bundleMovement} />
    </>
  );
};

export default StyleFlowPage;
