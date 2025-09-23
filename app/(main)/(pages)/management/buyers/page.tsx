'use client';

import axios from 'axios';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { EMPTY_TABLE_MESSAGE } from '@/app/constants';
import { InputText } from 'primereact/inputtext';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Buyer } from '@/app/types/buyers';
import { BuyerService } from '@/app/services/BuyerService';
import { ROUTES } from '@/app/constants/routes';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/modal/component';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageHeader from '@/app/components/page-header/component';
import React, { useContext, useCallback, useEffect, useState } from 'react';
import TableHeader from '@/app/components/table-header/component';
import PageTile from '@/app/components/page-title/component';
import { Image } from 'primereact/image';

interface BuyerPageState {
  deleteModalShow?: boolean;
  deleteId?: string | number;
}

interface SearchFilter {
  keyword?: string;
}

const BuyersPage = () => {
  const [pageState, setPageState] = useState<BuyerPageState>({});
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SearchFilter>({});
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ keyword: e.target.value });
  };

  const clearFilter = () => {
    setFilter({
      keyword: ''
    });
    fetchBuyers();
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter({
      ...filter,
      keyword: value
    });
    fetchBuyers();
  };

  const renderHeader = () => {
    return <TableHeader onClear={clearFilter} searchValue={filter.keyword ?? ''} onSearchChange={handleSearchChange} />;
  };

  const fetchBuyers = useCallback(
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
        const data = await BuyerService.getBuyers(search ? { search } : {}, { signal: controller.signal });
        setBuyers(getBuyers(data.data.data ?? []));
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
    fetchBuyers();
  }, [fetchBuyers]);

  const getBuyers = (data: Buyer[]) => {
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

  const dateBodyTemplate = (rowData: Buyer) => {
    return formatDate(new Date(rowData.created_at));
  };

  const imageBodyTemplate = (rowData: Buyer) => {
    return (
      <>
        {rowData?.buyer_logo_path && (
          <Image
            src={rowData.buyer_logo_path}
            alt={rowData.name}
            imageStyle={{ width: 50, height: 50, objectFit: 'cover' }}
            preview // opens a lightbox on click
          />
        )}
      </>
    );
  };

  const onActionEditClick = (id: string | number) => {
    router.push(`${ROUTES.BUYER.EDIT}/${id}`);
  };

  const onActionDeleteClick = (id: string | number) => {
    setPageState({
      ...pageState,
      deleteModalShow: true,
      deleteId: id
    });
  };

  const actionBodyTemplate = (rowData: Buyer) => {
    return (
      <>
        <Button icon="pi pi-pencil" onClick={() => onActionEditClick(rowData.id)} severity="warning" className="mr-2" />
        <Button icon="pi pi-trash" onClick={() => onActionDeleteClick(rowData.id)} severity="danger" />
      </>
    );
  };

  const handleDelete = async () => {
    try {
      await BuyerService.deleteBuyer(pageState.deleteId as string);
      showSuccess('Offset successfully deleted.');
      setPageState({ ...pageState, deleteModalShow: false });
      fetchBuyers();
    } catch (error: any) {
      showApiError(error, 'Failed to delete offset.');
    }
  };

  return (
    <>
      <PageTile title="Buyers" icon="pi pi-fw pi-cog" url={ROUTES.BUYER.INDEX} />
      <PageHeader titles={['Management', 'Buyers']}>
        <PageAction actionAdd={() => router.push(ROUTES.BUYER.CREATE)} actions={[PageActions.ADD]} />
      </PageHeader>

      <DataTable
        value={buyers}
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
        <Column field="id" header="ID" />
        <Column field="name" header="Name" style={{ minWidth: '12rem' }} />
        <Column header="Logo" field="buyer_logo_path" style={{ minWidth: '10rem' }} body={imageBodyTemplate} />
        <Column header="Added By" dataType="string" style={{ minWidth: '12rem' }} body={(buyer: Buyer) => buyer?.created_by?.name} />
        <Column header="Created At" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} />
        <Column header="Actions" body={actionBodyTemplate} style={{ minWidth: '10rem' }}></Column>
      </DataTable>
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

export default BuyersPage;
