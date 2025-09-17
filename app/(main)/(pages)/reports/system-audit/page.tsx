'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SystemAudit } from '@/app/types/system-audit';
import { EMPTY_TABLE_MESSAGE } from '@/app/constants';

import { ReportService } from '@/app/services/ReportService';
import PageHeader from '@/app/components/page-header/component';
import PageTile from '@/app/components/page-title/component';
import { ROUTES } from '@/app/constants/routes';
import React, { useContext, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TableHeader from '@/app/components/table-header/component';
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';

interface SearchFilter {
  keyword?: string;
}

const SystemAuditPage = () => {
  const router = useRouter();
  const [SystemAudits, setSystemAudits] = useState<SystemAudit[]>([]);
  const [filter, setFilter] = useState<SearchFilter>({});
  const [loading, setLoading] = useState(true);
  const [metaDialogVisible, setMetaDialogVisible] = useState(false);
  const [metaDialogContent, setMetaDialogContent] = useState<string>('');
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ keyword: e.target.value });
  };

  const clearFilter = () => {
    setFilter({
      keyword: ''
    });
    fetchSystemAudits();
  };

  const fetchSystemAudits = useCallback(
    async (keyword?: string) => {
      // Abort previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const search = keyword?.trim() || filter.keyword?.trim() || '';

      setLoading(true);
      try {
        // Pass signal to your service
        const data = await ReportService.getAllSystemAudit(search ? { search } : {}, { signal: controller.signal });
        console.log('data', data);
        setSystemAudits(data?.data?.data ?? []);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      } finally {
        // Only set loading to false if this is the latest controller
        if (abortControllerRef.current === controller) {
          setLoading(false);
        }
      }
    },
    [filter.keyword]
  );

  useEffect(() => {
    fetchSystemAudits();
  }, [fetchSystemAudits]);

  const renderHeader = () => {
    return <TableHeader onClear={clearFilter} searchValue={filter.keyword ?? ''} onSearchChange={handleSearchChange} />;
  };

  const formatDate = (value: Date) => {
    return value.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const dateBodyTemplate = (rowData: SystemAudit) => {
    return formatDate(new Date(rowData.created_at));
  };

  const jsonEllipsis = (json: any, maxLength = 30) => {
    const str = JSON.stringify(json);
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
  };

  const metaBodyTemplate = (rowData: SystemAudit) => {
    const metaStr = JSON.stringify(rowData.meta, null, 2);
    const truncated = jsonEllipsis(rowData.meta);
    return (
      <>
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline', color: '#007ad9' }}
          onClick={() => {
            setMetaDialogContent(metaStr);
            setMetaDialogVisible(true);
          }}
        >
          {truncated}
        </span>
      </>
    );
  };

  return (
    <>
      <PageTile title="System Audit" icon="pi pi-fw pi-sitemap" url={ROUTES.REPORTS.SYSTEM_AUDIT.INDEX} />
      <PageHeader titles={['Reports', 'System Audit']} />
      <DataTable
        value={SystemAudits}
        paginator
        className="p-datatable-gridlines"
        showGridlines
        rows={10}
        dataKey="id"
        filterDisplay="menu"
        loading={loading}
        emptyMessage={EMPTY_TABLE_MESSAGE}
        header={renderHeader()}
      >
        <Column field="id" header="ID" style={{ minWidth: '12rem' }} />
        <Column header="User" dataType="string" style={{ minWidth: '12rem' }} body={(data: SystemAudit) => data?.user?.name} />
        <Column field="action" header="Action" style={{ minWidth: '12rem' }} />
        <Column field="model" header="Model" style={{ minWidth: '12rem' }} />
        <Column field="meta" header="Meta" style={{ minWidth: '12rem' }} body={metaBodyTemplate} />
        <Column field="ip" header="IP" style={{ minWidth: '12rem' }} />
        <Column field="created_at" header="Created At" dataType="date" style={{ minWidth: '12rem' }} body={dateBodyTemplate} />
      </DataTable>
      <Dialog header="Meta Data" visible={metaDialogVisible} style={{ width: '50vw' }} onHide={() => setMetaDialogVisible(false)} modal>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{metaDialogContent}</pre>
      </Dialog>
    </>
  );
};

export default SystemAuditPage;
