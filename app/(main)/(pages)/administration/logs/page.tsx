'use client';

import { Badge } from 'primereact/badge';
import { Column } from 'primereact/column';
import { formatDateTime, formatRelativeDate } from '@/app/utils';
import { Log } from '@/app/types/logging';
import { LOG_LEVELS } from '@/app/constants/logging';
import { ROUTES } from '@/app/constants/routes';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomDatatable from '@/app/components/datatable/component';
import FormMultiDropdown from '@/app/components/form/multi-dropdown/component';
import LogService from '@/app/services/LogService';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageHeader from '@/app/components/page-header/component';
import React, { useCallback, useEffect, useState } from 'react';
import TableHeader from '@/app/components/table-header/component';
import useDatatable from '@/app/hooks/useDatatable';


const LogsPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramsLevel = searchParams.get('level');

  const { clearFilter, handleOnPageChange, filters, tableLoading, first, rows, setFilters, setTableLoading, setTotalRecords, totalRecords } =
    useDatatable();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ keyword: e.target.value });
  };

  const levelOptions = Object.keys(LOG_LEVELS).map((key) => ({
    label: key,
    value: LOG_LEVELS[key as keyof typeof LOG_LEVELS]
  }));

  const handlePageFilter = (e: any) => {
    setFilters({ ...filters, level: e.value });
  };

  const renderHeader = () => {
    return (
      <TableHeader onClear={clearFilter} searchValue={filters.keyword ?? ''} onSearchChange={handleSearchChange}>
        <div className="w-full md:w-20rem">
          <FormMultiDropdown
            value={filters.level}
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

    setTableLoading(true);
    try {
      const params = {
        search: filters.search,
        page: filters.page,
        per_page: filters.per_page,
        level: filters.level,
      };
      const { data } = await LogService.list(params, { signal: controller.signal });
      setTotalRecords(data.total ?? 0);
      setLogs(getLogs(data.data));
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error(error);
      }
    } finally {
      // Only set loading to false if this is the latest controller
      if (abortControllerRef.current === controller) {
        setTableLoading(false);
      }
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (paramsLevel) {
      setFilters({ ...filters, level: [paramsLevel] });
    }
  }, [paramsLevel])

  const getLogs = (data: Log[]) => {
    return [...(data || [])].map((d) => {
      return d;
    });
  };

  const dateBodyTemplate = (rowData: Log) => {
    return <span title={formatDateTime(new Date(rowData.created_at ?? ''))} className='text-grey-500 text-small'>{formatRelativeDate(new Date(rowData.created_at ?? ''))}</span>;
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

      <CustomDatatable
        value={logs}
        loading={tableLoading}
        onPage={handleOnPageChange}
        header={renderHeader()}
        first={first}
        rows={rows}
        totalRecords={totalRecords}
      >
        <Column field="id" header="ID" style={{ minWidth: '12rem' }} />
        <Column field="source" header="Source" style={{ minWidth: '12rem' }} />
        <Column field="level" header="Level" style={{ minWidth: '12rem' }} body={levelTemplate} />
        <Column field="content" header="Content" style={{ minWidth: '12rem' }} />
        <Column header="Log Time" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} />
      </CustomDatatable>

    </>
  );
};

export default LogsPage;
