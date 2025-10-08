'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { EMPTY_TABLE_MESSAGE } from '@/app/constants';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { PRINTING_MODELS } from '@/app/constants/barcode';
import { ROUTES } from '@/app/constants/routes';
import { StyleBundle } from '@/app/types/styles';
import { StyleBundleService } from '@/app/services/StyleBundleService';
import { useRouter } from 'next/navigation';
import BundleSinglePrintBarcode from '@/app/components/style/BundleSinglePrintBarcode';
import Modal from '@/app/components/modal/component';
import PageAction from '@/app/components/page-action/component';
import PageHeader from '@/app/components/page-header/component';
import PageTile from '@/app/components/page-title/component';
import PrintBarcode from '@/app/components/barcode/PrintBarcode';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import ReleaseBundles from './components/release-bundle';
import TableHeader from '@/app/components/table-header/component';
import { formatDate } from '@/app/utils';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Badge } from 'primereact/badge';

interface BundlePageState {
  deleteModalShow?: boolean;
  showSinglePrintBarcode?: boolean;
  showRelease?: boolean;
  showMultiPrintBarcode?: boolean;
  showUploading?: boolean;
}

interface SearchFilter {
  keyword?: string;
}

const BundlesPage = () => {
  const [pageState, setPageState] = useState<BundlePageState>({});
  const [selectedBundle, setSelectedBundle] = useState<StyleBundle | undefined>(undefined);
  const [bundles, setBundles] = useState<StyleBundle[]>([]);
  const [selectedBundles, setSelectedBundles] = useState<StyleBundle[]>([]);
  const [filters, setFilters] = useState<SearchFilter>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showApiError } = useContext(LayoutContext);

  const clearFilter1 = () => {
    setFilters({});
  };

  const fetchBundles = useCallback(async () => {
    setLoading(true);
    try {
      const search = filters.keyword?.trim() || '';
      const data = await StyleBundleService.getBundles(search ? { search } : {});

      setBundles(data.data.data ?? []);
    } catch (error: any) {
      showApiError(error, 'Error fetching bundles');
    } finally {
      setLoading(false);
    }
  }, [filters.keyword]);

  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ keyword: e.target.value });
  };

  const renderHeader1 = () => {
    return <TableHeader onClear={clearFilter1} onSearchChange={handleSearchChange} />;
  };

  const dateBodyTemplate = (rowData: StyleBundle) => {
    return formatDate(new Date(rowData.created_at ?? ''));
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
        <Button
          icon="pi pi-pencil"
          outlined
          rounded
          onClick={() => onActionEditClick(rowData.id?.toString() ?? '')}
          size="small"
          severity="warning"
        />
        <Button icon="pi pi-print" outlined rounded onClick={() => onSinglePrintBarcodeClick(rowData)} size="small" severity="help" />
        <Button icon="pi pi-trash" outlined rounded onClick={() => onActionDeleteClick()} size="small" severity="danger" />
      </div>
    );
  };

  const onBundleSelectionChange = (data: any) => {
    setSelectedBundles(data.value);
  };

  const header1 = renderHeader1();

  const bundleBodyTemplate = (rowData: StyleBundle) => {
    return (
      <>
        <span
          className="cursor-pointer"
          onClick={() => {
            router.push(`/operations/bundle-flow?bundle=${rowData?.bundle_number}&bundle_id=${rowData?.id}`);
          }}
        >
          {rowData.bundle_number}
        </span>
        {rowData.belong_style_bundle ? (
          <div
            className="mt-2 cursor-pointer"
            onClick={() => {
              router.push(
                `/operations/bundle-flow?bundle=${rowData.belong_style_bundle?.bundle_number}&bundle_id=${rowData.belong_style_bundle?.id}`
              );
            }}
          >
            <Badge value={`#${rowData.belong_style_bundle.bundle_number}`} size="normal" severity="success"></Badge>
          </div>
        ) : null}
      </>
    );
  };

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
        className="custom-table p-datatable-gridlines"
        showGridlines
        rows={10}
        dataKey="id"
        filterDisplay="menu"
        loading={loading}
        emptyMessage={EMPTY_TABLE_MESSAGE}
        selectionMode={'checkbox'}
        selection={selectedBundles}
        onSelectionChange={onBundleSelectionChange}
        header={header1}
        scrollable
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
        <Column field="bundle_number" header="Bundle#" body={bundleBodyTemplate} style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="style.style_number" header="Style#" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="style.buyer.name" header="Buyer" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="style.ship_date_from_cebu" header="Cebu Date" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="style.ship_date_from_japan" header="Japan Date" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column header="Color" field="style_planned_fabric.color" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="roll_number" header="Roll No." style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column header="Size" field="style_planned_fabric_size.size_number" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="quantity" header="Quantity" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="created_at" header="Released At" body={dateBodyTemplate} style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column
          field="balance"
          header="Action"
          body={actionBodyTemplate}
          bodyStyle={{ width: 'auto', whiteSpace: 'nowrap' }}
          alignFrozen="right"
          frozen
        ></Column>
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
      <PrintBarcode
        model={PRINTING_MODELS.STYLE_BUNDLE}
        ids={selectedBundles?.flatMap((r) => r.id?.toString() ?? '')}
        visible={pageState.showMultiPrintBarcode}
      />
    </>
  );
};

export default BundlesPage;
