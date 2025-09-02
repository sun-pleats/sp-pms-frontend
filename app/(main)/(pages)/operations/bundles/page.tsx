'use client';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import PageCard from '@/app/components/page-card/component';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/constants/routes';
import PageAction from '@/app/components/page-action/component';
import Modal from '@/app/components/modal/component';
import FormDropdown from '@/app/components/form/dropdown/component';
import BundleSinglePrintBarcode from '@/app/components/style/BundleSinglePrintBarcode';
import ReleaseBundles from './components/release-bundle';
import { StyleBundleService } from '@/app/services/StyleBundleService';
import { StyleBundle } from '@/app/types/styles';
import PageHeader from '@/app/components/page-header/component';
import TableHeader from '@/app/components/table-header/component';
import { EMPTY_TABLE_MESSAGE } from '@/app/constants';
import PageTile from '@/app/components/page-title/component';

interface BundlePageState {
  deleteModalShow?: boolean;
  showSinglePrintBarcode?: boolean;
  showRelease?: boolean;
  showMultiPrintBarcode?: boolean;
  showUploading?: boolean;
}

const BundlesPage = () => {
  const [pageState, setPageState] = useState<BundlePageState>({});
  const [selectedBundle, setSelectedBundle] = useState<StyleBundle | undefined>(undefined);

  const [bundles, setBundles] = useState<StyleBundle[]>([]);
  const [selectedBundles, setSelectedBundles] = useState<StyleBundle[]>([]);

  const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
  const [loading1, setLoading1] = useState(true);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  const router = useRouter();

  const clearFilter1 = () => {
    initFilters1();
  };

  const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    (_filters1['global'] as any).value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const renderHeader1 = () => {
    return <TableHeader onClear={clearFilter1} />;
  };

  useEffect(() => {
    StyleBundleService.getBundles().then(({ data }) => {
      setBundles(data.data ?? []);
      setLoading1(false);
    });
    initFilters1();
  }, []);

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      'country.name': {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
      },
      balance: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
      },
      status: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
      },
      activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
      verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    setGlobalFilterValue1('');
  };

  const onActionEditClick = (id: string | number) => {
    router.push(`${ROUTES.BUNDLES.EDIT}/${id}`);
  };

  const onActionDeleteClick = () => {
    setPageState({
      ...pageState,
      deleteModalShow: true
    });
  };

  const onSinglePrintBarcodeClick = (data: StyleBundle) => {
    setSelectedBundle(data);
    setPageState({
      ...pageState,
      showSinglePrintBarcode: true
    });
  };

  const actionBodyTemplate = (rowData: StyleBundle) => {
    return (
      <div className="flex flex-row gap-2">
        <Button icon="pi pi-pencil" onClick={() => onActionEditClick(rowData.id?.toString() ?? '')} size="small" severity="warning" />
        <Button icon="pi pi-print" onClick={() => onSinglePrintBarcodeClick(rowData)} size="small" severity="help" />
        <Button icon="pi pi-trash" onClick={() => onActionDeleteClick()} size="small" severity="danger" />
      </div>
    );
  };

  const onBundleSelectionChange = (data: any) => {
    setSelectedBundles(data.value);
  };

  const header1 = renderHeader1();

  return (
    <>
      <PageTile title="Release Bundles" icon="pi pi-fw pi-box" url={ROUTES.BUNDLES.INDEX} />
      <PageHeader titles={['Management', 'Release Bundles']}>
        <PageAction>
          <Button
            onClick={() => setPageState({ ...pageState, showRelease: true })}
            size="small"
            label="Release Bundle"
            icon="pi pi-arrow-up-right"
            style={{ marginRight: '.5em' }}
          />
          <Button
            onClick={() => setPageState({ ...pageState, showMultiPrintBarcode: true })}
            severity="help"
            size="small"
            label="Print Barcodes"
            icon="pi pi-print"
            style={{ marginRight: '.5em' }}
          />
        </PageAction>
      </PageHeader>
      <DataTable
        value={bundles}
        paginator
        className="p-datatable-gridlines"
        showGridlines
        rows={10}
        dataKey="id"
        filters={filters1}
        filterDisplay="menu"
        loading={loading1}
        emptyMessage={EMPTY_TABLE_MESSAGE}
        selectionMode={'checkbox'}
        selection={selectedBundles}
        onSelectionChange={onBundleSelectionChange}
        header={header1}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
        <Column field="bundle_number" header="Bundle#" style={{ minWidth: '12rem' }} />
        <Column field="style.style_number" header="Style#" style={{ minWidth: '12rem' }} />
        <Column field="style.buyer_name" header="Buyer" style={{ minWidth: '12rem' }} />
        <Column field="style.ship_date_from_cebu" header="Cebu Date" />
        <Column field="style.ship_date_from_japan" header="Japan Date" />
        <Column header="Color" field="style_planned_fabric.color" />
        <Column field="roll_number" header="Roll No."   />
        <Column header="Size" field="style_planned_fabric_size.size_number" />
        <Column field="quantity" header="Quantity" />
        <Column field="quantity" header="Location" />
        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
      </DataTable>
      <Modal
        title="Delete Record"
        visible={pageState.deleteModalShow}
        onHide={() => setPageState({ ...pageState, deleteModalShow: false })}
        confirmSeverity="danger"
      >
        <p>Are you sure you want to delete the record?</p>
      </Modal>
      <BundleSinglePrintBarcode
        bundle={selectedBundle}
        onHide={() => setPageState({ ...pageState, showSinglePrintBarcode: false })}
        visible={pageState.showSinglePrintBarcode}
      />
      <ReleaseBundles onHide={() => setPageState({ ...pageState, showRelease: false })} visible={pageState.showRelease} />
    </>
  );
};

export default BundlesPage;
