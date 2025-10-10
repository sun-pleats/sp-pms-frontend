'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Department } from '@/app/types/department';
import { DepartmentService } from '@/app/services/DepartmentService';
import { EMPTY_TABLE_MESSAGE } from '@/app/constants';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { PRINTING_MODELS } from '@/app/constants/barcode';
import { ROUTES } from '@/app/constants/routes';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/modal/component';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageHeader from '@/app/components/page-header/component';
import PageTile from '@/app/components/page-title/component';
import PrintBarcode from '@/app/components/barcode/PrintBarcode';
import React, { useContext, useCallback, useEffect, useState } from 'react';
import TableHeader from '@/app/components/table-header/component';

interface DepartmentPageState {
  deleteModalShow?: boolean;
  deleteId?: string | number;
  showPrint?: boolean;
}

interface SearchFilter {
  keyword?: string;
}

const DepartmentsPage = () => {
  const [pageState, setPageState] = useState<DepartmentPageState>({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SearchFilter>({});
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>();

  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ keyword: e.target.value });
  };

  const clearFilter = () => {
    setFilter({ keyword: '' });
    fetchDepartments('');
  };

  const renderHeader = () => {
    return <TableHeader onClear={clearFilter} searchValue={filter.keyword ?? ''} onSearchChange={handleSearchChange} />;
  };

  const fetchDepartments = useCallback(
    async (keyword?: string) => {
      // Abort previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      try {
        const search = keyword?.trim() || filter.keyword?.trim() || '';
        // Pass keyword to service if available
        const { data } = await DepartmentService.getDepartmentes(search ? { search } : {}, { signal: controller.signal });
        setDepartments(getDepartments(data.data ?? []));
      } catch (error: any) {
        if (error.name !== 'CanceledError') {
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
    fetchDepartments('');
  }, [fetchDepartments]);

  const getDepartments = (data: Department[]) => {
    return [...(data || [])].map((d) => {
      return d;
    });
  };

  const onPrintClick = (user: Department) => {
    setSelectedDepartment(user);
    setPageState({ ...pageState, showPrint: true });
  };

  const formatDate = (value: Date) => {
    return value.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const dateBodyTemplate = (rowData: Department) => {
    return formatDate(new Date(rowData.created_at));
  };

  const onActionEditClick = (id: string | number) => {
    router.push(`${ROUTES.DEPARTMENTS.EDIT}/${id}`);
  };

  const onActionDeleteClick = (id: string | number) => {
    setPageState({
      ...pageState,
      deleteModalShow: true,
      deleteId: id
    });
  };

  const actionBodyTemplate = (rowData: Department) => {
    return (
      <div className="flex flex-row gap-2">
        <Button icon="pi pi-print" outlined rounded onClick={() => onPrintClick(rowData)} size="small" />
        <Button
          icon="pi pi-pencil"
          onClick={() => onActionEditClick(rowData.id)}
          size="small"
          severity="warning"
          disabled={rowData.immutable}
          tooltip={rowData.immutable ? 'Immutable record and could not be edited.' : undefined}
          rounded
          outlined
        />
        <Button
          icon="pi pi-trash"
          onClick={() => onActionDeleteClick(rowData.id)}
          size="small"
          severity="danger"
          disabled={rowData.immutable}
          tooltip={rowData.immutable ? 'Immutable record and could not be deleted.' : undefined}
          rounded
          outlined
        />
      </div>
    );
  };

  const handleDelete = async () => {
    try {
      await DepartmentService.deleteDepartment(pageState.deleteId as string);
      showSuccess('Department successfully deleted.');
      setPageState({ ...pageState, deleteModalShow: false });
      fetchDepartments();
    } catch (error: any) {
      showApiError(error, 'Failed to delete Department.');
    }
  };

  return (
    <>
      <PageTile title="Departments" icon="pi pi-fw pi-building" url={ROUTES.DEPARTMENTS.INDEX} />
      <PageHeader titles={['Management', 'Departments']}>
        <PageAction actionAdd={() => router.push(ROUTES.DEPARTMENTS.CREATE)} actions={[PageActions.ADD]} />
      </PageHeader>
      <DataTable
        value={departments}
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
        <Column field="id" header="ID" />
        <Column field="name" header="Name" style={{ minWidth: '12rem' }} />
        <Column field="barcode" header="Barcode" style={{ minWidth: '12rem' }} />
        <Column header="Added By" dataType="string" style={{ minWidth: '12rem' }} body={(department: Department) => department?.created_by?.name} />
        <Column header="Created At" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} />
        <Column header="Actions" bodyStyle={{ width: 'auto', whiteSpace: 'nowrap' }} body={actionBodyTemplate} frozen alignFrozen="right"></Column>
      </DataTable>
      <PrintBarcode
        visible={pageState.showPrint}
        ids={[selectedDepartment?.id ?? '']}
        model={PRINTING_MODELS.DEPARTMENT}
        onHide={() => setPageState({ ...pageState, showPrint: false })}
      />
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

export default DepartmentsPage;
