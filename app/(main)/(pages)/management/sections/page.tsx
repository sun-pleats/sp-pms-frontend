'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ROUTES } from '@/app/constants/routes';
import { Section } from '@/app/types/section';
import { SectionService } from '@/app/services/SectionService';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/modal/component';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageHeader from '@/app/components/page-header/component';
import PageTile from '@/app/components/page-title/component';
import React, { useContext, useCallback, useEffect, useState } from 'react';
import TableHeader from '@/app/components/table-header/component';
import CustomDatatable from '@/app/components/datatable/component';
import useDatatable from '@/app/hooks/useDatatable';
import { Badge } from 'primereact/badge';

interface SectionPageState {
  deleteModalShow?: boolean;
  deleteId?: string | number;
}

const SectionsPage = () => {
  const [pageState, setPageState] = useState<SectionPageState>({});
  const [Sections, setSections] = useState<Section[]>([]);
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const router = useRouter();

  const { clearFilter, handleOnPageChange, filters, tableLoading, first, rows, setFilters, setTableLoading, setTotalRecords, totalRecords } =
    useDatatable();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const renderHeader = () => {
    return <TableHeader onClear={clearFilter} searchValue={filters.search ?? ''} onSearchChange={handleSearchChange} />;
  };

  const fetchSections = useCallback(async () => {
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

      const data = await SectionService.getSections(params, { signal: controller.signal });
      setTotalRecords(data.data.total ?? 0);
      setSections(getSections(data.data.data ?? []));
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
  }, [filters]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const getSections = (data: Section[]) => {
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

  const dateBodyTemplate = (rowData: Section) => {
    return formatDate(new Date(rowData.created_at ?? ''));
  };

  const breakTimesBodyTemplate = (rowData: Section) => {
    return (
      <div className="grid gap-2">
        {rowData.breaktimes?.map((r) => (
          <Badge title={`${r.time_start}-${r.time_end} -> ${r.type}`} value={`${r.time_start} ${r.type}`} />
        ))}
      </div>
    );
  };

  const onActionEditClick = (id: string | number) => {
    router.push(`${ROUTES.SECTION.EDIT}/${id}`);
  };

  const onActionDeleteClick = (id: string | number) => {
    setPageState({
      ...pageState,
      deleteModalShow: true,
      deleteId: id
    });
  };

  const actionBodyTemplate = (rowData: Section) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          outlined
          rounded
          onClick={() => onActionEditClick(rowData.id ?? '')}
          size="small"
          severity="warning"
          className="mr-2"
        />
        <Button icon="pi pi-trash" outlined rounded onClick={() => onActionDeleteClick(rowData.id ?? '')} size="small" severity="danger" />
      </>
    );
  };

  const handleDelete = async () => {
    try {
      await SectionService.deleteSection(pageState.deleteId as string);
      showSuccess('Section successfully deleted.');
      setPageState({ ...pageState, deleteModalShow: false });
      fetchSections();
    } catch (error: any) {
      showApiError(error, 'Failed to delete section.');
    }
  };

  return (
    <>
      <PageTile title="Sections" icon="pi pi-fw pi-sitemap" url={ROUTES.SECTION.INDEX} />
      <PageHeader titles={['Management', 'Sections']}>
        <PageAction actionAdd={() => router.push(ROUTES.SECTION.CREATE)} actions={[PageActions.ADD]} />
      </PageHeader>
      <CustomDatatable
        value={Sections}
        header={renderHeader()}
        loading={tableLoading}
        onPage={handleOnPageChange}
        first={first}
        rows={rows}
        totalRecords={totalRecords}
      >
        <Column field="id" header="ID" style={{ minWidth: '12rem' }} />
        <Column field="name" header="Name" style={{ minWidth: '12rem' }} />
        <Column field="department.name" header="Department" style={{ minWidth: '12rem' }} />
        <Column field="breaktimes" header="Breaktimes" body={breakTimesBodyTemplate} />
        <Column field="shift_start" header="Shift Start" style={{ minWidth: '12rem' }} />
        <Column field="shift_end" header="Shift End" style={{ minWidth: '12rem' }} />
        <Column header="Added By" dataType="string" style={{ minWidth: '12rem' }} body={(section: Section) => section?.created_by?.name} />
        <Column field="created_at" header="Created At" body={dateBodyTemplate} />
        <Column header="Actions" bodyStyle={{ width: 'auto', whiteSpace: 'nowrap' }} body={actionBodyTemplate} frozen alignFrozen="right"></Column>
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

export default SectionsPage;
