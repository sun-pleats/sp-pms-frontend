'use client';

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { EMPTY_TABLE_MESSAGE } from '@/app/constants';
import { ROUTES } from '@/app/constants/routes';
import { useRouter } from 'next/navigation';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageHeader from '@/app/components/page-header/component';
import React, { useCallback, useEffect, useState } from 'react';
import TableHeader from '@/app/components/table-header/component';
import LogService from '@/app/services/LogService';
import { Log } from '@/app/types/logging';
import { LOG_LEVELS } from '@/app/constants/logging';
import { Badge } from 'primereact/badge';
import { formatDateTime } from '@/app/utils';
import FormMultiDropdown from '@/app/components/form/multi-dropdown/component';

interface SearchFilter {
  keyword?: string;
  level?: string;
}

const LogsPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<SearchFilter>({});
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const router = useRouter();
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ keyword: e.target.value });
  };
  const levelOptions = Object.keys(LOG_LEVELS).map((key) => ({
    label: key,
    value: LOG_LEVELS[key as keyof typeof LOG_LEVELS]
  }));

  const clearFilter = () => {
    setFilter({
      keyword: ''
    });
    fetchLogs();
  };

  const handlePageFilter = (e: any) => {
    setFilter({ ...filter, level: e.value });
  };

  const renderHeader = () => {
    return (
      <TableHeader onClear={clearFilter} searchValue={filter.keyword ?? ''} onSearchChange={handleSearchChange}>
        <div className="w-full md:w-20rem">
          <FormMultiDropdown
            value={filter.level}
            onChange={handlePageFilter}
            filter
            options={levelOptions}
            placeholder="Filter Level"
            className="w-full"
          />
        </div>
      </TableHeader>
    );
  };

  const fetchLogs = useCallback(async () => {
    // Abort previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const { data } = await LogService.list({ ...filter }, { signal: controller.signal });
      setLogs(getLogs(data.data));
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
  }, [filter.keyword, filter.level]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getLogs = (data: Log[]) => {
    return [...(data || [])].map((d) => {
      return d;
    });
  };

  const dateBodyTemplate = (rowData: Log) => {
    return formatDateTime(new Date(rowData.created_at ?? ''));
  };

  const levelTemplate = (rowData: Log) => {
    switch (rowData.level) {
      case LOG_LEVELS.DEBUG:
        return <Badge value="DEBUG" severity="secondary" />;
      case LOG_LEVELS.INFO:
        return <Badge value="INFO" severity="info" />;
      case LOG_LEVELS.WARN:
        return <Badge value="WARN" severity="warning" />;
      case LOG_LEVELS.ERROR:
        return <Badge value="ERROR" severity="danger" />;
      case LOG_LEVELS.SUCCESS:
        return <Badge value="SUCCESS" severity="success" />;
      default:
        return <Badge value="UNKNOWN" />;
    }
  };

  return (
    <>
      <PageHeader titles={['Administration', 'Logs']}>
        <PageAction actionAdd={() => router.push(ROUTES.USERS.CREATE)} actions={[PageActions.ADD]} />
      </PageHeader>
      <DataTable
        value={logs}
        paginator
        className="custom-table p-datatable-gridlines"
        showGridlines
        rows={10}
        dataKey="id"
        filterDisplay="menu"
        loading={loading}
        emptyMessage={EMPTY_TABLE_MESSAGE}
        header={renderHeader()}
        scrollable
      >
        <Column field="id" header="ID" style={{ minWidth: '12rem' }} />
        <Column field="source" header="Source" style={{ minWidth: '12rem' }} />
        <Column field="level" header="Level" style={{ minWidth: '12rem' }} body={levelTemplate} />
        <Column field="content" header="Content" style={{ minWidth: '12rem' }} />
        <Column header="Log Time" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} />
      </DataTable>
    </>
  );
};

export default LogsPage;
