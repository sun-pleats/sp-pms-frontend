'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Process } from '@/app/types/process';
import { ProcessService } from '@/app/services/ProcessService';
import { ROUTES } from '@/app/constants/routes';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/modal/component';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageHeader from '@/app/components/page-header/component';
import React, { useContext, useCallback, useEffect, useState } from 'react';
import TableHeader from '@/app/components/table-header/component';
import PageTile from '@/app/components/page-title/component';
import CustomDatatable from '@/app/components/datatable/component';
import useDatatable from '@/app/hooks/useDatatable';
import { Badge } from 'primereact/badge';
import { Checkbox } from 'primereact/checkbox';

interface ProcessPageState {
  deleteModalShow?: boolean;
  deleteId?: string | number;
}

interface SearchFilter {
  keyword?: string;
}

const ProcessesPage = () => {
  const [pageState, setPageState] = useState<ProcessPageState>({});
  const [processes, setProcesses] = useState<Process[]>([]);
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const router = useRouter();

  const { clearFilter, handleOnPageChange, filters, tableLoading, first, rows, setFilters, setTableLoading, setTotalRecords, totalRecords } =
    useDatatable();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const renderHeader = () => {
    return (
      <TableHeader onClear={clearFilter} searchValue={filters.search ?? ''} onSearchChange={handleSearchChange}>
        <div className="mr-auto">
          <Checkbox
            inputId="exclude_report"
            onChange={(e) => setFilters({ ...filters, exclude_report: e.checked })}
            checked={filters.exclude_report ?? false}
          />
          <label className="ml-2" htmlFor="exclude_report">
            Show Exclude Report
          </label>
        </div>
      </TableHeader>
    );
  };

  const fetchProcesses = useCallback(async () => {
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
        exclude_report: filters.exclude_report ? '1' : undefined
      };

      const data = await ProcessService.getProcesses(params, { signal: controller.signal });
      setTotalRecords(data.data.total ?? 0);
      setProcesses(getProcesses(data.data.data ?? []));
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
    fetchProcesses();
  }, [fetchProcesses]);

  const getProcesses = (data: Process[]) => {
    return [...(data || [])].map((d) => {
      return d;
    });
  };

  const formatDate = (value: Date) => {
    return value.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const dateBodyTemplate = (rowData: Process) => {
    return formatDate(new Date(rowData.created_at));
  };

  const onActionEditClick = (id: string | number) => {
    router.push(`${ROUTES.PROCESS.EDIT}/${id}`);
  };

  const onActionDeleteClick = (id: string | number) => {
    setPageState({
      ...pageState,
      deleteModalShow: true,
      deleteId: id
    });
  };

  const actionBodyTemplate = (rowData: Process) => {
    return (
      <>
        <Button icon="pi pi-pencil" outlined rounded onClick={() => onActionEditClick(rowData.id)} severity="warning" className="mr-2" />
        <Button icon="pi pi-trash" outlined rounded onClick={() => onActionDeleteClick(rowData.id)} severity="danger" />
      </>
    );
  };

  const handleDelete = async () => {
    try {
      await ProcessService.deleteProcess(pageState.deleteId as string);
      showSuccess('Process successfully deleted.');
      setPageState({ ...pageState, deleteModalShow: false });
      fetchProcesses();
    } catch (error: any) {
      showApiError(error, 'Failed to delete process.');
    }
  };

  return (
    <>
      <PageTile title="Processes" icon="pi pi-fw pi-cog" url={ROUTES.PROCESS.INDEX} />
      <PageHeader titles={['Management', 'Processes']}>
        <PageAction actionAdd={() => router.push(ROUTES.PROCESS.CREATE)} actions={[PageActions.ADD]} />
      </PageHeader>
      <CustomDatatable
        value={processes}
        header={renderHeader()}
        loading={tableLoading}
        onPage={handleOnPageChange}
        first={first}
        rows={rows}
        totalRecords={totalRecords}
      >
        <Column field="id" header="ID" />
        <Column
          field="code"
          header="Code"
          style={{ minWidth: '12rem' }}
          body={(process: Process) => (
            <>
              <span>{process.code}</span>
              {process.exclude_report && (
                <div className="mt-2" title="This process will be excluded from the total efficiency percentage.">
                  <small>
                    <Badge className="bg-red-400" value="Exclude Report"></Badge>
                  </small>
                </div>
              )}
            </>
          )}
        />
        <Column field="name" header="Name" style={{ minWidth: '12rem' }} />
        <Column header="Added By" dataType="string" style={{ minWidth: '12rem' }} body={(process: Process) => process?.created_by?.name} />
        <Column header="Created At" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} />
        <Column header="Actions" body={actionBodyTemplate} bodyStyle={{ width: 'auto', whiteSpace: 'nowrap' }} frozen alignFrozen="right"></Column>
      </CustomDatatable>
      <Modal
        title="Delete Record"
        visible={pageState.deleteModalShow}
        onHide={() => setPageState({ ...pageState, deleteModalShow: false })}
        confirmSeverity="danger"
        onConfirm={() => handleDelete()}
      >
        <p>Are you sure you want to delete the record?</p>
      </Modal>
    </>
  );
};

export default ProcessesPage;
