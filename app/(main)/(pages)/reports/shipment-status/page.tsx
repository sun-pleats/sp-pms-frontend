'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { EMPTY_TABLE_MESSAGE } from '@/app/constants';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ReportService } from '@/app/services/ReportService';
import { ReportShipmentStatus } from '@/app/types/reports';
import { ROUTES } from '@/app/constants/routes';
import FormRangeCalendar from '@/app/components/form/range-calendar/component';
import PageHeader from '@/app/components/page-header/component';
import PageTile from '@/app/components/page-title/component';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import TableHeader from '@/app/components/table-header/component';
import { formatDbDate } from '@/app/utils';

interface SearchFilter {
  keyword?: string;
  dates?: Date[];
}

const ShipmentStatusPage = () => {
  const [ShipmentStatuses, setShipmentStatuses] = useState<ReportShipmentStatus[]>([]);
  const [filter, setFilter] = useState<SearchFilter>({});
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { showApiError, showSuccess } = useContext(LayoutContext);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ keyword: e.target.value });
  };

  const clearFilter = () => {
    setFilter({
      keyword: ''
    });
    fetchShipmentStatuses();
  };

  const fetchShipmentStatuses = useCallback(async () => {
    setLoading(true);
    try {
      // Pass signal to your service
      const data = await ReportService.getAllShipmentStatus({
        search: filter.keyword,
        dates: filter.dates ? filter.dates?.flatMap((date) => formatDbDate(date)) : undefined
      });
      setShipmentStatuses(data?.data.data ?? []);
    } catch (error: any) {
      showApiError(error, 'Failed fetching report.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchShipmentStatuses();
  }, [fetchShipmentStatuses]);

  const renderHeader = () => {
    return <TableHeader onClear={clearFilter} searchValue={filter.keyword ?? ''} onSearchChange={handleSearchChange} />;
  };

  const onExportExcelClick = async () => {
    try {
      setDownloading(true);
      const response = await ReportService.exportShipmentStatus({
        search: filter.keyword,
        dates: filter.dates ? filter.dates?.flatMap((date) => formatDbDate(date)) : undefined
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'shipment_statuses.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showSuccess('Successfully exported and please check the download files.');
    } catch (error) {
      showApiError(error, 'Error exporting');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <PageTile title="Shipment Status" icon="pi pi-fw pi-building" url={ROUTES.REPORTS.SYSTEM_AUDIT.INDEX} />
      <PageHeader titles={['Reports', 'Shipment Status']} />
      <div className="flex flex-align-items-center">
        <div className="flex flex-align-items-center mr-2">
          <div className="flex align-items-center gap-2">
            <FormRangeCalendar
              value={filter.dates}
              onChange={(e: any) => setFilter({ ...filter, dates: e.value })}
              label="Shipment Date"
              placeholder="Select Date"
              readOnlyInput
              hideOnRangeSelection
            />
            <Button
              label="Export Excel"
              loading={downloading}
              onClick={onExportExcelClick}
              size="small"
              style={{ marginTop: '0.8rem' }}
              icon="pi pi-file-excel"
            />
          </div>
        </div>
      </div>

      <DataTable
        value={ShipmentStatuses}
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
        <Column field="style_no" header="Style No." style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="shipment_date" header="Shipment Date" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="order_quantity" header="Order QTY" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="saidan" header="Saidan" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="at_machine" header="AT Machine" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="maekoutei_sewing" header="Maekoutei Sewing" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="maekoutei_chuukan_qc" header="Maekoutei Chuukan QC" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="flat_iron" header="Flat Iron" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="shitsuke" header="Shitsuke" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="machine_pleats" header="Machine Pleats" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="handpleats" header="Handpleats" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="kumitate_sewing" header="Kumitate Sewing" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="kumitate_chuukan_qc" header="Kumitate Chuukan QC" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
        <Column field="final_qc" header="Final QC" style={{ width: 'auto', whiteSpace: 'nowrap' }} />
      </DataTable>
    </>
  );
};

export default ShipmentStatusPage;
