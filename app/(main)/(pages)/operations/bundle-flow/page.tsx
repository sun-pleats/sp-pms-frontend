'use client';

import { AutoCompleteSelectEvent } from 'primereact/autocomplete';
import { BundleMovementRecord } from '@/app/types/styles';
import { Option } from '@/app/types';
import { ROUTES } from '@/app/constants/routes';
import { useContext, useEffect, useState } from 'react';
import BundleEntryFlow from '@/app/components/bundle/BundleEntryFlow';
import PageTile from '@/app/components/page-title/component';
import RemoteStyleBundleDropdown from '@/app/components/remote/style-bundle/component';
import { StyleBundleService } from '@/app/services/StyleBundleService';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useSearchParams } from 'next/navigation';
import { Badge } from 'primereact/badge';

const StyleFlowPage = () => {
  const [selectedStyleNumber, setSelectedStyleNumber] = useState<Option | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isStaticRender, setIsStaticRender] = useState<boolean>(false);
  const [bundleMovement, setBundleMovement] = useState<BundleMovementRecord[]>([]);
  const handleSelectedStyle = (option: AutoCompleteSelectEvent<Option>) => {
    fetchBundleFlow(option.value?.value?.toString());
  };

  const searchParams = useSearchParams();
  const bundleNumber = searchParams.get('bundle');
  const bundleId = searchParams.get('bundle_id');

  useEffect(() => {
    if (bundleId && bundleNumber) {
      setIsStaticRender(true);
      fetchBundleFlow(bundleId);
    }
  }, [bundleNumber, bundleId]);

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
      {!isStaticRender && (
        <RemoteStyleBundleDropdown value={selectedStyleNumber} onSelect={handleSelectedStyle} onChange={(option) => setSelectedStyleNumber(option)} />
      )}
      {isStaticRender && (
        <p className="">
          Selected Bundle: <Badge value={bundleNumber} severity="success" />{' '}
          <Badge
            onClick={() => {
              setIsStaticRender(false);
            }}
            className="cursor-pointer"
            value="Clear"
            severity="secondary"
          />
        </p>
      )}
      <p className="mt-2">Visualizes how a bundle moves across departments, showing entry/exit times, user, and duration for each step.</p>
      <BundleEntryFlow loading={isFetching} records={bundleMovement} />
    </>
  );
};

export default StyleFlowPage;
