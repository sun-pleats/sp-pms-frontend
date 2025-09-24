'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { EMPTY_TABLE_MESSAGE } from '@/app/constants';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import { Style } from '@/app/types/styles';
import { StyleService } from '@/app/services/StyleService';
import { useRouter } from 'next/navigation';
import FormMultiDropdown from '@/app/components/form/multi-dropdown/component';
import Modal from '@/app/components/modal/component';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageHeader from '@/app/components/page-header/component';
import PageTile from '@/app/components/page-title/component';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import TableHeader from '@/app/components/table-header/component';
import UploadStyles from './components/upload-styles';
import useUtilityData from '@/app/hooks/useUtilityData';

interface StylePageState {
  deleteModalShow?: boolean;
  showMultiPrintBarcode?: boolean;
  showSinglePrintBarcode?: boolean;
  showUploading?: boolean;
  deleteId?: string | number;
}

interface PageFilter {
  buyers?: string[];
  keyword?: string
}

const StylesPage = () => {

  const [pageState, setPageState] = useState<StylePageState>({});
  const [pageFilter, setPageFilter] = useState<PageFilter>({});
  const [selectedStyles, setSelectedStyles] = useState<Style[]>([]);
  const [buyerOptions, setBuyerOptions] = useState<SelectItem[]>([]);
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { fetchBuyersSelectOption } = useUtilityData();
  const [styles, setStyle] = useState<Style[]>([]);

  const clearPageFilter = () => {
    setPageFilter({ ...pageFilter, keyword: '' });
  };

  const handlePageFilter = (e: any) => {
    setPageFilter({ ...pageFilter, buyers: e.value });
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageFilter({ ...pageFilter, keyword: e.target.value });
  };

  const tableHeader = () => {
    return (
      <TableHeader onClear={clearPageFilter} searchValue={pageFilter.keyword ?? ''} onSearchChange={handleSearchChange}>
        <div className="w-full md:w-20rem">
          <FormMultiDropdown
            value={pageFilter.buyers}
            onChange={handlePageFilter}
            filter
            options={buyerOptions}
            optionValue="label"
            placeholder="Filter Buyer"
            className="w-full"
          />
        </div>
      </TableHeader>
    );
  };

  const initData = async () => {
    setBuyerOptions(await fetchBuyersSelectOption())
  }

  const fetchStyles = useCallback(
    async (keyword?: string) => {
      setLoading(true);
      const search = keyword?.trim() || pageFilter.keyword?.trim() || '';
      const buyer = pageFilter.buyers || [];

      // Build payload dynamically
      const payload: any = {};
      if (search) payload.search = search;
      if (buyer.length > 0) payload.buyer = buyer;

      const { data } = await StyleService.getStyles(payload);
      setStyle(getStyles(data.data ?? []));
      setLoading(false);
    },
    [pageFilter.keyword, pageFilter.buyers]
  );

  const getStyles = (data: Style[]) => {
    return [...(data || [])].map((d) => {
      return d;
    });
  };

  useEffect(() => {
    fetchStyles();
  }, [fetchStyles]);

  useEffect(() => {
    initData();
  }, []);

  const onActionEditClick = (id: string | number) => {
    router.push(`${ROUTES.STYLES_EDIT}/${id}`);
  }

  const onActionDeleteClick = (id: string | number) => {
    setPageState({
      ...pageState,
      deleteModalShow: true,
      deleteId: id
    })
  }

  const actionBodyTemplate = (rowData: Style) => {
    return (
      <div className='flex flex-row gap-2'>
        <Button icon="pi pi-pencil" onClick={() => onActionEditClick(rowData.id)} size='small' severity="warning" />
        <Button icon="pi pi-trash" onClick={() => onActionDeleteClick(rowData.id)} size='small' severity="danger" />
      </div>
    );
  };

  const onStyleSelectionChange = (data: any) => {
    setSelectedStyles(data.value)
  }

  const handleDelete = async () => {
    try {
      await StyleService.deleteStyle(pageState.deleteId as string);
      showSuccess('Style successfully deleted.');
      setPageState({ ...pageState, deleteModalShow: false });
      fetchStyles();
    } catch (error: any) {
      showApiError(error, 'Failed to delete Style.');
    }
  };

  return (
    <>
      <PageTile title='Styles' icon='pi pi-fw pi-clone' url={ROUTES.STYLES_INDEX} />
      <PageHeader titles={['Management', 'Styles']}>
        <PageAction
          actionAdd={() => router.push(ROUTES.STYLES_CREATE)}
          actionUpload={() => setPageState({ ...pageState, showUploading: true })}
          actions={[
            PageActions.ADD,
            PageActions.UPLAOD
          ]}
        />
      </PageHeader>
      <DataTable
        value={styles}
        paginator
        className="p-datatable-gridlines"
        showGridlines
        rows={10}
        dataKey="id"
        scrollable
        loading={loading}
        emptyMessage={EMPTY_TABLE_MESSAGE}
        selectionMode={'checkbox'}
        selection={selectedStyles}
        onSelectionChange={onStyleSelectionChange}
        header={tableHeader}
      >
        {/* <Column
          selectionMode="multiple"
          headerStyle={{ width: '3em' }}
        /> */}
        <Column field="control_number" header="Control#" style={{ minWidth: '12rem' }} />
        <Column field="style_number" header="Style#" style={{ minWidth: '12rem' }} />
        <Column field="buyer_name" header="Buyer" style={{ minWidth: '12rem' }} />
        <Column field="pleats_name" header="Pleats" style={{ minWidth: '12rem' }} />
        <Column header="Japan Date" field="ship_date_from_japan" />
        <Column field="ship_date_from_cebu" header="Cebu Date" />
        <Column field="season" header="Season" style={{ minWidth: '12rem' }} />
        <Column header="Actions" body={actionBodyTemplate}></Column>
      </DataTable>

      <Modal
        title='Delete Record'
        visible={pageState.deleteModalShow}
        onHide={() => setPageState({ ...pageState, deleteModalShow: false })}
        confirmSeverity='danger'
        onConfirm={handleDelete}
      >
        <p>Are you sure you want to delete the record?</p>
      </Modal>
      <UploadStyles onHide={() => setPageState({ ...pageState, showUploading: false })} visible={pageState.showUploading} />
    </>
  );
};

export default StylesPage;
