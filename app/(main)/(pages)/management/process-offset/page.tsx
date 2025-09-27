'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { EMPTY_TABLE_MESSAGE } from '@/app/constants';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ProcessOffset } from '@/app/types/process-offset';
import { ProcessOffsetService } from '@/app/services/ProcessOffsetService';
import { ROUTES } from '@/app/constants/routes';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/modal/component';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageHeader from '@/app/components/page-header/component';
import React, { useContext, useCallback, useEffect, useState } from 'react';
import TableHeader from '@/app/components/table-header/component';
import PageTile from '@/app/components/page-title/component';
import PrintBarcode from '@/app/components/barcode/PrintBarcode';
import { PRINTING_MODELS } from '@/app/constants/barcode';

interface ProcessOffsetPageState {
  deleteModalShow?: boolean;
  deleteId?: string | number;
  showPrint?: boolean;
}

interface SearchFilter {
  keyword?: string;
}

const ProcessOffsetsPage = () => {
  const [pageState, setPageState] = useState<ProcessOffsetPageState>({});
  const [processOffsets, setProcessOffsets] = useState<ProcessOffset[]>([]);
  const [selectedOffset, setSelectedOffset] = useState<ProcessOffset>();

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SearchFilter>({});
  const router = useRouter();
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ keyword: e.target.value });
  };

  const clearFilter = () => {
    setFilter({
      keyword: ''
    });
    fetchProcessOffsets();
  };

  const renderHeader = () => {
    return <TableHeader onClear={clearFilter} searchValue={filter.keyword ?? ''} onSearchChange={handleSearchChange} />;
  };

  const fetchProcessOffsets = useCallback(
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
        const { data } = await ProcessOffsetService.getProcessOffsets(search ? { search } : {}, { signal: controller.signal });
        setProcessOffsets(getProcessOffsets(data.data ?? []));
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
    fetchProcessOffsets();
  }, [fetchProcessOffsets]);

  const getProcessOffsets = (data: ProcessOffset[]) => {
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

  const dateBodyTemplate = (rowData: ProcessOffset) => {
    return formatDate(new Date(rowData.created_at));
  };

  const onActionDeleteClick = (id: string | number) => {
    setPageState({
      ...pageState,
      deleteModalShow: true,
      deleteId: id
    });
  };

  const onActionEditClick = (id: string | number) => {
    router.push(`${ROUTES.PROCESS_OFFSETS.EDIT}/${id}`);
  };

  const actionBodyTemplate = (rowData: ProcessOffset) => {
    return (
      <>
        <Button
          icon="pi pi-print"
          onClick={() => {
            setSelectedOffset(rowData);
            setPageState({ ...pageState, showPrint: true });
          }}
          title="Print Barcode"
          size="small"
          severity="success"
          className="mr-2"
        />
        <Button icon="pi pi-pencil" onClick={() => onActionEditClick(rowData.id)} size="small" severity="warning" className="mr-2" />
        <Button icon="pi pi-trash" onClick={() => onActionDeleteClick(rowData.id)} size="small" severity="danger" />
      </>
    );
  };

  const handleDelete = async () => {
    try {
      await ProcessOffsetService.deleteProcessOffset(pageState.deleteId as string);
      showSuccess('Process offset successfully deleted.');
      setPageState({ ...pageState, deleteModalShow: false });
      fetchProcessOffsets();
    } catch (error) {
      showApiError(error, 'Failed to delete process offset.');
    }
  };

  return (
    <>
      <PageTile title="Process Offset" icon="pi pi-fw pi-sliders-h" url={ROUTES.PROCESS_OFFSETS.INDEX} />
      <PageHeader titles={['Management', 'Process Offsets']}>
        <PageAction actionAdd={() => router.push(ROUTES.PROCESS_OFFSETS.CREATE)} actions={[PageActions.ADD]} />
      </PageHeader>

      <DataTable
        value={processOffsets}
        paginator
        className="custom-table p-datatable-gridlines"
        showGridlines
        rows={10}
        dataKey="id"
        filterDisplay="menu"
        loading={loading}
        emptyMessage={EMPTY_TABLE_MESSAGE}
        header={renderHeader()}
      >
        <Column field="id" header="ID" style={{ minWidth: '12rem' }} />
        <Column field="name" header="Name" style={{ minWidth: '12rem' }} />
        <Column field="description" header="Description" style={{ minWidth: '12rem' }} />
        <Column header="Added By" dataType="string" style={{ minWidth: '12rem' }} body={(data: ProcessOffset) => data?.created_by?.name} />
        <Column field="created_at" header="Created At" body={dateBodyTemplate} />
        <Column header="Actions" body={actionBodyTemplate} style={{ minWidth: '13rem' }}></Column>
      </DataTable>
      <Modal
        title="Delete Record"
        visible={pageState.deleteModalShow}
        onHide={() => setPageState({ ...pageState, deleteModalShow: false })}
        confirmSeverity="danger"
        onConfirm={handleDelete}
      >
        <p>Are you sure you want to delete the record?</p>
      </Modal>
      <PrintBarcode
        visible={pageState.showPrint}
        ids={[selectedOffset?.id ?? '']}
        model={PRINTING_MODELS.PROCESS_OFFSET}
        onHide={() => setPageState({ ...pageState, showPrint: false })}
      />
    </>
  );
};

export default ProcessOffsetsPage;
