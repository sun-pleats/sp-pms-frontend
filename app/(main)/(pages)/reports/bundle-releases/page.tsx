'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { EMPTY_TABLE_MESSAGE } from '@/app/constants';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ReportService } from '@/app/services/ReportService';
import { ReportStyleBundleEntryLog } from '@/app/types/reports';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import FormMultiDropdown from '@/app/components/form/multi-dropdown/component';
import FormRangeCalendar from '@/app/components/form/range-calendar/component';
import PageHeader from '@/app/components/page-header/component';
import PageTile from '@/app/components/page-title/component';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import TableHeader from '@/app/components/table-header/component';
import useUtilityData from '@/app/hooks/useUtilityData';
import { currentMonthDates, formatDbDate } from '@/app/utils';

interface SearchFilter {
  keyword?: string;
  dates?: Date[];
  department_ids?: string[];
}

const BundleReleasePage = () => {
  const [BundleEntries, setBundleEntries] = useState<ReportStyleBundleEntryLog[]>([]);
  const [filter, setFilter] = useState<SearchFilter>({
    dates: currentMonthDates()
  });
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [fetchingUtils, setFetchingUtils] = useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const [departmentOptions, setDepartments] = useState<SelectItem[]>([]);
  const { fetchDepartmentOptions } = useUtilityData();
  const { showApiError, showSuccess } = useContext(LayoutContext);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ keyword: e.target.value });
  };

  const clearFilter = () => {
    setFilter({
      keyword: ''
    });
    fetchBundleEntries();
  };

  const fetchBundleEntries = useCallback(async () => {
    setLoading(true);
    try {
      // Pass signal to your service
      const data = await ReportService.getAllBundleEntryLogs({ ...filter, dates: filter.dates?.flatMap((date) => formatDbDate(date)) });
      setBundleEntries(data?.data.data ?? []);
    } catch (error: any) {
      showApiError(error, 'Failed fetching report.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchBundleEntries();
  }, [fetchBundleEntries]);

  useEffect(() => {
    initData();
  }, []);

  const renderHeader = () => {
    return <TableHeader onClear={clearFilter} searchValue={filter.keyword ?? ''} onSearchChange={handleSearchChange} />;
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
      const response = await ReportService.exportAllBundleEntryLogs({ ...filter, dates: filter.dates?.flatMap((date) => formatDbDate(date)) });
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

  return (
    <>
      <PageTile title="Bundle Releases" icon="pi pi-fw pi-sitemap" url={ROUTES.REPORTS.SYSTEM_AUDIT.INDEX} />
      <PageHeader titles={['Reports', 'Bundle Releases']} />
      <div className="flex flex-align-items-center">
        <div className="flex flex-align-items-center mr-2">
          <div className="flex align-items-center gap-2">
            <FormRangeCalendar
              value={filter.dates}
              onChange={(e: any) => setFilter({ ...filter, dates: e.value })}
              label="Logged Date"
              readOnlyInput
              hideOnRangeSelection
            />
            <FormMultiDropdown
              label="Departments"
              value={filter.department_ids}
              onChange={(option: SelectItem) => setFilter({ ...filter, department_ids: option.value })}
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

      <DataTable
        value={BundleEntries}
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
        <Column field="style_number" header="Style #" />
        <Column field="bundle_number" header="Bundle #" />
        <Column field="quantity" header="Released QTY" />
        <Column field="roll_number" header="Roll No." />
        <Column field="size_number" header="Size No." />
        <Column field="remarks" header="Bundle Remarks" />
        <Column field="color" header="Color" />
        <Column field="department_name" header="Department" />
        <Column field="entry_time" header="Entry" />
        <Column field="exit_time" header="Exit" />
        <Column field="hours_stayed" header="Hours Stayed" />
        <Column field="log_remarks" header="Log Remarks" />
      </DataTable>
    </>
  );
};

export default BundleReleasePage;
