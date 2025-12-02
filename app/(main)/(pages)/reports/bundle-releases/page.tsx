'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { currentMonthDates, formatDbDate } from '@/app/utils';
import { DataTable } from 'primereact/datatable';
import { EMPTY_TABLE_MESSAGE } from '@/app/constants';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ReportService } from '@/app/services/ReportService';
import { ReportStyleBundleEntryLog } from '@/app/types/reports';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import { useRouter } from 'next/navigation';
import FormMultiDropdown from '@/app/components/form/multi-dropdown/component';
import FormRangeCalendar from '@/app/components/form/range-calendar/component';
import PageHeader from '@/app/components/page-header/component';
import PageTile from '@/app/components/page-title/component';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import TableHeader from '@/app/components/table-header/component';
import useUtilityData from '@/app/hooks/useUtilityData';
import DateSelectors from '@/app/components/date-selector/component';
import CustomDatatable from '@/app/components/datatable/component';
import useDatatable from '@/app/hooks/useDatatable';

const BundleReleasePage = () => {
  const [BundleEntries, setBundleEntries] = useState<ReportStyleBundleEntryLog[]>([]);

  const [downloading, setDownloading] = useState(false);
  const [fetchingUtils, setFetchingUtils] = useState(false);
  const [departmentOptions, setDepartments] = useState<SelectItem[]>([]);
  const { fetchDepartmentOptions } = useUtilityData();
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const router = useRouter();

  const { clearFilter, handleOnPageChange, filters, tableLoading, first, rows, setFilters, setTableLoading, setTotalRecords, totalRecords } =
    useDatatable();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const fetchBundleEntries = useCallback(async () => {
    setTableLoading(true);
    try {
      const params = {
        ...filters,
        dates: filters.dates?.flatMap((date: Date) => formatDbDate(date))
      };

      // Pass signal to your service
      const data = await ReportService.getAllBundleEntryLogs(params);
      setBundleEntries(data?.data.data ?? []);
      setTotalRecords(data?.data.total ?? 0);
    } catch (error: any) {
      showApiError(error, 'Failed fetching report.');
    } finally {
      setTableLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBundleEntries();
  }, [fetchBundleEntries]);

  useEffect(() => {
    initData();
    setFilters({
      dates: currentMonthDates(),
      department_ids: []
    });
  }, []);

  const renderHeader = () => {
    return <TableHeader onClear={clearFilter} searchValue={filters.search ?? ''} onSearchChange={handleSearchChange} />;
  };

  const initData = async () => {
    try {
      setFetchingUtils(true);
      // Fetch processes
      const departments = await fetchDepartmentOptions();
      setDepartments(departments);
    } catch (error) {
      showApiError(error, 'Failed fetching options.');
    } finally {
      setFetchingUtils(false);
    }
  };

  const onExportExcelClick = async () => {
    try {
      setDownloading(true);

      const params = {
        ...filters,
        dates: filters.dates?.flatMap((date: Date) => formatDbDate(date))
      };

      const response = await ReportService.exportAllBundleEntryLogs(params);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bundle_releases.xlsx');
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

  const bundleBodyTemplate = (rowData: ReportStyleBundleEntryLog) => {
    return (
      <>
        {rowData.released_at && <i className="pi pi-check-circle text-green-500 mr-2" title="Released"></i>}
        <span
          className="cursor-pointer"
          onClick={() => {
            router.push(`/operations/bundle-flow?bundle=${rowData?.bundle_number}&bundle_id=${rowData?.style_bundle_id}`);
          }}
        >
          {rowData.bundle_number}
        </span>
      </>
    );
  };

  return (
    <>
      <PageTile title="Bundle Entry Log Report" icon="pi pi-fw pi-box" url={ROUTES.REPORTS.SYSTEM_AUDIT.INDEX} />
      <PageHeader titles={['Reports', 'Bundle Entry Log Report']} />
      <div className="flex flex-align-items-center">
        <div className="flex flex-align-items-center mr-2">
          <div className="flex align-items-center gap-2">
            <FormRangeCalendar
              value={filters.dates}
              onChange={(e: any) => setFilters({ ...filters, dates: e.value })}
              label="Logged Date"
              readOnlyInput
              hideOnRangeSelection
            />
            <FormMultiDropdown
              label="Departments"
              value={filters.department_ids}
              onChange={(option: SelectItem) => setFilters({ ...filters, department_ids: option.value })}
              filter={true}
              placeholder="Select"
              loading={fetchingUtils}
              options={departmentOptions}
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

      <DateSelectors
        className="mb-2"
        onDateSelected={(dates: Date[] | null) => {
          if (dates) setFilters({ ...filters, dates });
          else setFilters({ ...filters, dates: undefined });
        }}
      />

      <CustomDatatable
        value={BundleEntries}
        loading={tableLoading}
        onPage={handleOnPageChange}
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        header={renderHeader()}
      >
        <Column
          field="style_number"
          headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }}
          bodyStyle={{ width: 'auto', whiteSpace: 'nowrap' }}
          alignFrozen="left"
          frozen
          header="Style No."
        />
        <Column
          field="bundle_number"
          body={bundleBodyTemplate}
          style={{ width: 'auto', whiteSpace: 'nowrap' }}
          alignFrozen="left"
          frozen
          header="Bundle No."
        />
        <Column field="section_name" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Section" alignFrozen="left" frozen />
        <Column field="quantity" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Released QTY" />
        <Column field="roll_number" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Roll No." />
        <Column field="size_number" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Size No." />
        <Column field="remarks" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Bundle Remarks" />
        <Column field="color" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Color" />
        <Column field="department_name" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Department" />
        <Column
          field="entry_time"
          headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }}
          bodyStyle={{ width: 'auto', whiteSpace: 'nowrap' }}
          header="Entry"
        />
        <Column
          field="exit_time"
          headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }}
          bodyStyle={{ width: 'auto', whiteSpace: 'nowrap' }}
          header="Exit"
        />
        <Column field="hours_stayed" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Hours Stayed" />
        <Column field="log_remarks" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Log Remarks" />
      </CustomDatatable>
    </>
  );
};

export default BundleReleasePage;
