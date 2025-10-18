'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Operator } from '@/app/types/operator';
import { OperatorService } from '@/app/services/OperatorService';
import { ROUTES } from '@/app/constants/routes';
import { useRouter } from 'next/navigation';
import CustomDatatable from '@/app/components/datatable/component';
import Modal from '@/app/components/modal/component';
import OperatorPrintBarcode from '@/app/components/operators/OperatorPrintBarcode';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageHeader from '@/app/components/page-header/component';
import PageTile from '@/app/components/page-title/component';
import React, { useContext, useCallback, useEffect, useState } from 'react';
import TableHeader from '@/app/components/table-header/component';
import useDatatable from '@/app/hooks/useDatatable';

interface OperatorPageState {
  deleteModalShow?: boolean;
  deleteId?: string | number;
}

interface SearchFilter {
  keyword?: string;
}

const OperatorsPage = () => {
  const [pageState, setPageState] = useState<OperatorPageState>({});
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Operator>();

  const [showPrint, setShowPrint] = useState<boolean>(false);
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const { clearFilter, handleOnPageChange, filters, tableLoading, first, rows, setFilters, setTableLoading, setTotalRecords, totalRecords } =
    useDatatable();

  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const renderHeader = () => {
    return <TableHeader onClear={clearFilter} searchValue={filters.search ?? ''} onSearchChange={handleSearchChange} />;
  };

  const fetchOperators = useCallback(
    async (keyword?: string) => {
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
          per_page: filters.per_page
        };

        const { data } = await OperatorService.getOperators(params, { signal: controller.signal });
        setTotalRecords(data.total ?? 0);
        setOperators(getOperators(data.data ?? []));
      } catch (error: any) {
        if (error.name !== 'CanceledError') {
          console.error(error);
        }
      } finally {
        // Only set loading to false if this is the latest controller
        if (abortControllerRef.current === controller) {
          setTableLoading(false);
        }
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchOperators();
  }, [fetchOperators]);

  const getOperators = (data: Operator[]) => {
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

  const dateBodyTemplate = (rowData: Operator) => {
    return <span title={formatDate(new Date(rowData.created_at ?? ''))}>{formatDate(new Date(rowData.created_at ?? ''))}</span>;
  };

  const processTemplate = (rowData: Operator) => {
    return rowData.operator_processes?.flatMap((r) => r.process.name)?.join(', ');
  };

  const onActionEditClick = (id: string | number) => {
    router.push(`${ROUTES.OPERATORS.EDIT}/${id}`);
  };

  const onActionDeleteClick = (id: string | number) => {
    setPageState({
      ...pageState,
      deleteModalShow: true,
      deleteId: id
    });
  };

  const actionBodyTemplate = (rowData: Operator) => {
    return (
      <div className="flex flex-row gap-2">
        <Button
          icon="pi pi-print"
          onClick={() => {
            setSelectedOperator(rowData);
            setShowPrint(true);
          }}
          title="Print Process Codes"
          size="small"
          severity="success"
          outlined
          rounded
          disabled={!rowData.operator_processes?.length}
        />
        <Button icon="pi pi-pencil" outlined rounded onClick={() => onActionEditClick(rowData.id)} size="small" severity="warning" />
        <Button icon="pi pi-trash" outlined rounded onClick={() => onActionDeleteClick(rowData.id)} size="small" severity="danger" />
      </div>
    );
  };

  const handleDelete = async () => {
    try {
      await OperatorService.deleteOperator(pageState.deleteId as string);
      showSuccess('Operator successfully deleted.');
      setPageState({ ...pageState, deleteModalShow: false });
      fetchOperators();
    } catch (error: any) {
      showApiError(error, 'Failed to delete Operator.');
    }
  };

  return (
    <>
      <PageTile title="Operators" icon="pi pi-fw pi-users" url={ROUTES.OPERATORS.INDEX} />
      <PageHeader titles={['Management', 'Operators']}>
        <PageAction actionAdd={() => router.push(ROUTES.OPERATORS.CREATE)} actions={[PageActions.ADD]} />
      </PageHeader>
      <CustomDatatable
        value={operators}
        header={renderHeader()}
        loading={tableLoading}
        onPage={handleOnPageChange}
        first={first}
        rows={rows}
        totalRecords={totalRecords}
      >
        <Column header="ID" field="id" />
        <Column header="Name" field="name" style={{ minWidth: '10rem' }} />
        <Column field="section.name" header="Section" style={{ minWidth: '12rem' }} />
        <Column field="section.department.name" header="Department" style={{ minWidth: '12rem' }} />
        <Column field="line_id" header="Processes" style={{ minWidth: '12rem' }} body={processTemplate} />
        <Column header="Added By" dataType="string" style={{ minWidth: '12rem' }} body={(operator: Operator) => operator?.created_by?.name} />
        <Column header="Created At" field="created_at" dataType="created_at" body={dateBodyTemplate} />
        <Column header="Actions" body={actionBodyTemplate} bodyStyle={{ width: 'auto', whiteSpace: 'nowrap' }} frozen alignFrozen="right"></Column>
      </CustomDatatable>
      <Modal
        title="Delete Record"
        visible={pageState.deleteModalShow}
        onHide={() => setPageState({ ...pageState, deleteModalShow: false })}
        confirmSeverity="danger"
        onConfirm={handleDelete}
      >
        <p>Are you sure you want to delete the record?</p>
      </Modal>
      <OperatorPrintBarcode visible={showPrint} operator={selectedOperator} onHide={() => setShowPrint(false)} />
    </>
  );
};

export default OperatorsPage;
