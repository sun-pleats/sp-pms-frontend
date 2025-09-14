import { StyleBundle } from '@/app/types/styles';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useEffect, useMemo, useState } from 'react';

interface DashboardStatisticsProps {
  value?: StyleBundle[];
  loading?: boolean;
}

const DashboardRecentBundles = ({ value, loading }: DashboardStatisticsProps) => {
  const bundles = useMemo(() => value, [value]);
  return (
    <div className="card">
      <h5>Recent Released Bundles</h5>
      <DataTable value={bundles} rows={5} loading={loading} paginator>
        <Column field="style.style_number" header="Style #" sortable style={{ width: '35%' }} />
        <Column field="bundle_number" header="Bundle #" sortable style={{ width: '35%' }} />
        <Column field="quantity" header="Quantity" sortable style={{ width: '35%' }} />
        <Column field="remarks" header="Remarks" sortable style={{ width: '35%' }} />
        <Column
          header="View"
          style={{ width: '15%' }}
          body={() => (
            <>
              <Button icon="pi pi-search" text />
            </>
          )}
        />
      </DataTable>
    </div>
  );
};
export default DashboardRecentBundles;
