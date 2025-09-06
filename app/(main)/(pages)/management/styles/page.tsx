'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { EMPTY_TABLE_MESSAGE } from '@/app/constants';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import { Style } from '@/app/types/styles';
import { useRouter } from 'next/navigation';
import { useStylePage } from './hooks/useStylePage';
import FormMultiDropdown from '@/app/components/form/multi-dropdown/component';
import Modal from '@/app/components/modal/component';
import MultiplePrintBarcode from '@/app/components/style/MultiplePrintBarcode';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageCard from '@/app/components/page-card/component';
import PageHeader from '@/app/components/page-header/component';
import PageTile from '@/app/components/page-title/component';
import React, { useEffect, useState } from 'react';
import SinglePrintBarcode from '@/app/components/style/SinglePrintBarcode';
import TableHeader from '@/app/components/table-header/component';
import UploadStyles from './components/upload-styles';
import useUtilityData from '@/app/hooks/useUtilityData';

interface StylePageState {
  deleteModalShow?: boolean;
  showMultiPrintBarcode?: boolean;
  showSinglePrintBarcode?: boolean;
  showUploading?: boolean;
}

interface PageFilter {
  buyers?: string[];
}

const StylesPage = () => {

  const [pageState, setPageState] = useState<StylePageState>({});
  const [selectedStyle, setSelectedStyle] = useState<Style | undefined>(undefined);
  const [pageFilter, setPageFilter] = useState<PageFilter>({});
  const [selectedStyles, setSelectedStyles] = useState<Style[]>([]);
  const [buyerOptions, setBuyerOptions] = useState<SelectItem[]>([]);
  const [filters1, setFilters1] = useState<DataTableFilterMeta>({});

  const router = useRouter();
  const { fetchBuyersSelectOption } = useUtilityData();
  const { fetchStyles, styles, isFetchStyleLoading } = useStylePage();

  const clearPageFilter = () => {
    setPageFilter({});
  };



  const handlePageFilter = (e: any) => {
    setPageFilter({ ...pageFilter, buyers: e.value });
  }

  const tableHeader = () => {
    return (
      <TableHeader onClear={clearPageFilter}>
        <div className="w-full md:w-20rem">
          <FormMultiDropdown
            value={pageFilter.buyers}
            onChange={handlePageFilter}
            filter
            options={buyerOptions}
            placeholder="Filter Buyer"
            className="w-full"
          />
        </div>
      </TableHeader>
    );
  };

  const initData = async () => {
    fetchStyles();
    setBuyerOptions(await fetchBuyersSelectOption())
  }

  useEffect(() => {
    initData();
  }, []);

  const onActionEditClick = (id: string | number) => {
    router.push(`${ROUTES.STYLES_EDIT}/${id}`);
  }

  const onActionDeleteClick = () => {
    setPageState({
      ...pageState,
      deleteModalShow: true
    })
  }

  const actionBodyTemplate = (rowData: Style) => {
    return (
      <div className='flex flex-row gap-2'>
        <Button icon="pi pi-pencil" onClick={() => onActionEditClick(1)} size='small' severity="warning" />
        <Button icon="pi pi-trash" onClick={() => onActionDeleteClick()} size='small' severity="danger" />
      </div>
    );
  };

  const onStyleSelectionChange = (data: any) => {
    setSelectedStyles(data.value)
  }

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
        filters={filters1}
        scrollable
        loading={isFetchStyleLoading}
        emptyMessage={EMPTY_TABLE_MESSAGE}
        selectionMode={'checkbox'}
        selection={selectedStyles}
        onSelectionChange={onStyleSelectionChange}
        header={tableHeader}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: '3em' }}
        />
        <Column field="control_number" header="Control#" style={{ minWidth: '12rem' }} />
        <Column field="style_number" header="Style#" style={{ minWidth: '12rem' }} />
        <Column field="buyer_name" header="Buyer" style={{ minWidth: '12rem' }} />
        <Column field="pleats_name" header="Pleats" style={{ minWidth: '12rem' }} />
        <Column header="Japan Date" field="ship_date_from_japan" />
        <Column field="ship_date_from_cebu" header="Cebu Date" />
        <Column header="Actions" body={actionBodyTemplate}></Column>
      </DataTable>

      <Modal
        title='Delete Record'
        visible={pageState.deleteModalShow}
        onHide={() => setPageState({ ...pageState, deleteModalShow: false })}
        confirmSeverity='danger'
      >
        <p>Are you sure you want to delete the record?</p>
      </Modal>
      <SinglePrintBarcode style={selectedStyle} onHide={() => setPageState({ ...pageState, showSinglePrintBarcode: false })} visible={pageState.showSinglePrintBarcode} />
      <UploadStyles onHide={() => setPageState({ ...pageState, showUploading: false })} visible={pageState.showUploading} />
      <MultiplePrintBarcode styles={selectedStyles} onHide={() => setPageState({ ...pageState, showMultiPrintBarcode: false })} visible={pageState.showMultiPrintBarcode} />
    </>

  );
};

export default StylesPage;
