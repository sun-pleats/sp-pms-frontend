'use client';

import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { formatDate } from '@/app/utils';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { PRINTING_MODELS } from '@/app/constants/barcode';
import { ROUTES } from '@/app/constants/routes';
import { StyleBundle } from '@/app/types/styles';
import { StyleBundleService } from '@/app/services/StyleBundleService';
import { useRouter } from 'next/navigation';
import BundleSinglePrintBarcode from '@/app/components/style/BundleSinglePrintBarcode';
import CustomDatatable from '@/app/components/datatable/component';
import Modal from '@/app/components/modal/component';
import PageAction from '@/app/components/page-action/component';
import PageHeader from '@/app/components/page-header/component';
import PageTile from '@/app/components/page-title/component';
import PrintBarcode from '@/app/components/barcode/PrintBarcode';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import ReleaseBundles from './components/release-bundle';
import TableHeader from '@/app/components/table-header/component';
import useDatatable from '@/app/hooks/useDatatable';
import ScanReleaseBundle from './components/scan-release';

interface BundlePageState {
  deleteModalShow?: boolean;
  scanReleaseShow?: boolean;
  releaseModalShow?: boolean;
  showSinglePrintBarcode?: boolean;
  showRelease?: boolean;
  showMultiPrintBarcode?: boolean;
  showUploading?: boolean;
  deleteId?: string | number;
}

const BundlesPage = () => {
  const [pageState, setPageState] = useState<BundlePageState>({});
  const [selectedBundle, setSelectedBundle] = useState<StyleBundle | undefined>(undefined);
  const [bundles, setBundles] = useState<StyleBundle[]>([]);
  const [selectedBundles, setSelectedBundles] = useState<StyleBundle[]>([]);
  const { showApiError, showSuccess } = useContext(LayoutContext);

  const router = useRouter();

  const { clearFilter, filters, handleOnPageChange, tableLoading, first, rows, setFilters, setTableLoading, setTotalRecords, totalRecords } =
    useDatatable();

  const fetchBundles = useCallback(async () => {
    setTableLoading(true);
    try {
      const params = {
        search: filters.search,
        page: filters.page,
        per_page: filters.per_page
      };

      const data = await StyleBundleService.getBundles(params);
      setTotalRecords(data.data.total ?? 0);

      setBundles(data.data.data ?? []);
    } catch (error: any) {
      showApiError(error, 'Error fetching bundles');
    } finally {
      setTableLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const renderHeader = () => {
    return <TableHeader onClear={clearFilter} onSearchChange={handleSearchChange} />;
  };

  const dateBodyTemplate = (rowData: StyleBundle) => {
    if (!rowData.released_at) return null;
    return formatDate(new Date(rowData.released_at ?? ''));
  };

  const onActionEditClick = (id: string | number) => {
    router.push(`${ROUTES.BUNDLES.EDIT}/${id}`);
  };

  const onActionDeleteClick = (id: string | number) => {
    setPageState({
      ...pageState,
      deleteModalShow: true,
      deleteId: id
    });
  };

  const onSinglePrintBarcodeClick = (data: StyleBundle) => {
    setSelectedBundle(data);
    setPageState({
      ...pageState,
      showSinglePrintBarcode: true
    });
  };

  const onReleaseBundle = (rowData: StyleBundle) => {
    setSelectedBundle(rowData);
    setPageState({
      ...pageState,
      releaseModalShow: true
    });
  };

  const releaseBundle = async () => {
    try {
      await StyleBundleService.releaseFabricBundle(selectedBundle?.id?.toString() ?? '');
      showSuccess('Bundle successfully released.');
      setPageState({ ...pageState, releaseModalShow: false });
      fetchBundles();
    } catch (error: any) {
      showApiError(error, 'Failed to release bundle.');
    }
  };

  const actionBodyTemplate = (rowData: StyleBundle) => {
    return (
      <div className="flex flex-row gap-2">
        {!rowData.released && (
          <Button icon="pi pi-arrow-up-right" outlined rounded onClick={() => onReleaseBundle(rowData)} size="small" severity="info" />
        )}
        <Button
          icon="pi pi-pencil"
          outlined
          rounded
          onClick={() => onActionEditClick(rowData.id?.toString() ?? '')}
          size="small"
          severity="warning"
        />
        <Button icon="pi pi-print" outlined rounded onClick={() => onSinglePrintBarcodeClick(rowData)} size="small" severity="help" />
        <Button
          icon="pi pi-trash"
          outlined
          rounded
          onClick={() => onActionDeleteClick(rowData.id?.toString() ?? '')}
          size="small"
          severity="danger"
        />
      </div>
    );
  };

  const onBundleSelectionChange = (data: any) => {
    setSelectedBundles(data.value);
  };

  const header1 = renderHeader();

  const bundleBodyTemplate = (rowData: StyleBundle) => {
    return (
      <>
        {rowData.released_at && <i className="pi pi-check-circle text-green-500 mr-2" title="Released"></i>}
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

  const handleDelete = async () => {
    try {
      await StyleBundleService.deleteBundle(pageState.deleteId as string);
      showSuccess('Release Bundle successfully deleted.');
      setPageState({ ...pageState, deleteModalShow: false });
      fetchBundles();
    } catch (error: any) {
      showApiError(error, 'Failed to delete record.');
    }
  };

  const quantityBody = (data: StyleBundle) => {
    return `${data.quantity}${data.postfix ?? ''}`;
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F8') {
        event.preventDefault();
        setPageState({
          ...pageState,
          scanReleaseShow: true
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
          <Button
            onClick={() => setPageState({ ...pageState, scanReleaseShow: true })}
            severity="info"
            outlined
            size="small"
            label="Scan [F8]"
            icon="pi pi-arrow-up-right"
            style={{ marginRight: '.5em' }}
          />
        </PageAction>
      </PageHeader>
      <CustomDatatable
        value={bundles}
        first={first}
        rows={rows}
        loading={tableLoading}
        selection={selectedBundles}
        onPage={handleOnPageChange}
        onSelectionChange={onBundleSelectionChange}
        header={header1}
        totalRecords={totalRecords}
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
        <Column field="quantity" header="Quantity" body={quantityBody} style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="section.name" header="Section" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="released_at" header="Released At" body={dateBodyTemplate} style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column
          field="balance"
          header="Action"
          body={actionBodyTemplate}
          bodyStyle={{ width: 'auto', whiteSpace: 'nowrap' }}
          alignFrozen="right"
          frozen
        ></Column>
      </CustomDatatable>

      <Modal
        title="Release Bundle"
        visible={pageState.releaseModalShow}
        onHide={() => setPageState({ ...pageState, releaseModalShow: false })}
        confirmSeverity="info"
        onConfirm={releaseBundle}
      >
        <p>Do you want to release this bundle?</p>
      </Modal>

      <Modal
        title="Delete Record"
        visible={pageState.deleteModalShow}
        onHide={() => setPageState({ ...pageState, deleteModalShow: false })}
        confirmSeverity="danger"
        onConfirm={handleDelete}
      >
        <p>Are you sure you want to delete the record?</p>
      </Modal>
      <ScanReleaseBundle
        visible={pageState.scanReleaseShow}
        onHide={() => {
          fetchBundles();
          setPageState({ ...pageState, scanReleaseShow: false });
        }}
      />
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
