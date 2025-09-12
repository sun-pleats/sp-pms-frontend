'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { EMPTY_TABLE_MESSAGE } from '@/app/constants';
import { formatDbDate } from '@/app/utils';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ProductionDailyOutput } from '@/app/types/reports';
import { ReportService } from '@/app/services/ReportService';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import FormCalendar from '@/app/components/form/calendar/component';
import FormMultiDropdown from '@/app/components/form/multi-dropdown/component';
import PageTile from '@/app/components/page-title/component';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import useUtilityData from '@/app/hooks/useUtilityData';
import OperatorPerformanceCard from '@/app/components/reports/operator-performance-card/OperatorPerformanceCard';
import { TabPanel, TabView } from 'primereact/tabview';

interface SearchFilter {
  keyword?: string;
  section_ids?: string[];
  process_ids?: string[];
  dates?: Date[];
  operator_ids?: string[];
}

interface Loadings {
  fetchingProcesses?: boolean;
  fetchingOperator?: boolean;
  fetchingSections?: boolean;
  fetchingOutputs?: boolean;
  exporting?: boolean;
}

const DailyProductionOutputsPage = () => {
  const [dailyProductionOutputs, setDailyProductionOutputs] = useState<ProductionDailyOutput[]>([]);
  const [loadings, setLoadings] = useState<Loadings>({});
  const [filter, setFilter] = useState<SearchFilter>({
    dates: [
      new Date(new Date().setDate(new Date().getDate() - 7)),
      new Date() // start = today
    ]
  });
  const [processOptions, setProcessOptions] = useState<SelectItem[]>();
  const [sectionOptions, setSectionOptions] = useState<SelectItem[]>();
  const [operatorOptions, setOperatorOptions] = useState<SelectItem[]>([]);
  const { fetchProcessOptions, fetchOperatorOptions, fetchSectionSelectOption } = useUtilityData();
  const { showApiError, showSuccess } = useContext(LayoutContext);

  useEffect(() => {
    initData();
  }, []);

  const initData = () => {
    // Fetch processes
    fetchProcessOptions()
      .then((data) => {
        setProcessOptions(data);
      })
      .catch((e) => showApiError(e, 'Failed fetching options.'))
      .finally(() => setLoadings({ fetchingProcesses: false }));

    // Fetch processes
    fetchOperatorOptions()
      .then((data) => {
        setOperatorOptions(data);
      })
      .catch((e) => showApiError(e, 'Failed fetching options.'))
      .finally(() => setLoadings({ fetchingOperator: false }));

    // Fetch sections
    fetchSectionSelectOption()
      .then((data) => {
        setSectionOptions(data);
      })
      .catch((e) => showApiError(e, 'Failed fetching options.'))
      .finally(() =>
        setTimeout(() => {
          setLoadings({ fetchingSections: false });
        }, 1000)
      );
  };

  const fetchDailyProductionOutputs = useCallback(async () => {
    setLoadings({ ...loadings, fetchingOutputs: true });
    const data = await ReportService.getProductionDailyOutput({ ...filter, dates: filter.dates?.flatMap((date) => formatDbDate(date)) });
    setDailyProductionOutputs(data.data.data ?? []);
    setLoadings({ ...loadings, fetchingOutputs: false });
  }, [filter]);

  useEffect(() => {
    fetchDailyProductionOutputs();
  }, [fetchDailyProductionOutputs]);

  const onExportExcelClick = async () => {
    try {
      setLoadings({ exporting: true });
      const response = await ReportService.exportProductionDailyOutput({ ...filter, dates: filter.dates?.flatMap((date) => formatDbDate(date)) });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'production_daily_outputs.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showSuccess('Successfully exported and please check the download files.');
    } catch (error) {
      showApiError(error, 'Error exporting');
    } finally {
      setLoadings({ exporting: false });
    }
  };

  return (
    <>
      <PageTile title="Daily Production Outputs" icon="pi pi-fw pi-sitemap" url={ROUTES.REPORTS.PRODUCTION_DAILY_OUTPUT.INDEX} />
      <div className="flex flex-align-items-center">
        <div className="flex flex-align-items-center mr-2">
          <div className="flex align-items-center gap-2">
            <FormCalendar
              value={filter.dates}
              onChange={(e: any) => setFilter({ ...filter, dates: e.value })}
              label="Operation Date"
              selectionMode="range"
              readOnlyInput
              hideOnRangeSelection
            />
            <FormMultiDropdown
              label="Operators"
              value={filter.operator_ids}
              onChange={(option: SelectItem) => setFilter({ ...filter, operator_ids: option.value })}
              filter={true}
              placeholder="Select"
              options={operatorOptions}
            />
            <FormMultiDropdown
              label="Section"
              value={filter.section_ids}
              onChange={(option: SelectItem) => setFilter({ ...filter, section_ids: option.value })}
              filter={true}
              placeholder="Select"
              options={sectionOptions}
            />
            <FormMultiDropdown
              loading={loadings.fetchingProcesses}
              label="Process"
              filter={true}
              value={filter.process_ids}
              onChange={(option: any) => setFilter({ ...filter, process_ids: option.value })}
              placeholder="Select"
              options={processOptions}
            />
            <Button
              loading={loadings.exporting}
              onClick={onExportExcelClick}
              label="Export Excel"
              size="small"
              style={{ marginTop: '0.8rem' }}
              icon="pi pi-file-excel"
            />
          </div>
        </div>
      </div>
      <TabView>
        <TabPanel header="Card View" leftIcon="pi pi-th-large mr-2">
          <OperatorPerformanceCard loading={loadings.fetchingOutputs} outputs={dailyProductionOutputs} />
        </TabPanel>
        <TabPanel header="List View" leftIcon="pi pi-list mr-2">
          <DataTable
            value={dailyProductionOutputs}
            paginator
            className="p-datatable-gridlines"
            showGridlines
            rows={10}
            dataKey="id"
            filterDisplay="menu"
            loading={loadings.fetchingOutputs}
            emptyMessage={EMPTY_TABLE_MESSAGE}
          >
            <Column field="id" header="ID" style={{ minWidth: '12rem' }} frozen={true} />
            <Column field="operator_name" header="Operator" style={{ minWidth: '12rem' }} />
            <Column field="process_name" header="Process" style={{ minWidth: '12rem' }} />
            <Column field="log_date" header="Date" style={{ minWidth: '12rem' }} />
            <Column field="12AM" header="12AM" />
            <Column field="1AM" header="1AM" />
            <Column field="2AM" header="2AM" />
            <Column field="3AM" header="3AM" />
            <Column field="4AM" header="4AM" />
            <Column field="5AM" header="5AM" />
            <Column field="6AM" header="6AM" />
            <Column field="7AM" header="7AM" />
            <Column field="8AM" header="8AM" />
            <Column field="9AM" header="9AM" />
            <Column field="10AM" header="10AM" />
            <Column field="11AM" header="11AM" />
            <Column field="12PM" header="12PM" />
            <Column field="1PM" header="1PM" />
            <Column field="3PM" header="3PM" />
            <Column field="4PM" header="4PM" />
            <Column field="5PM" header="5PM" />
            <Column field="6PM" header="6PM" />
            <Column field="7PM" header="7PM" />
            <Column field="8PM" header="8PM" />
            <Column field="9PM" header="9PM" />
            <Column field="10PM" header="10PM" />
            <Column field="11PM" header="11PM" />
            <Column field="total_output" header="Total Output" style={{ width: '10rem' }} frozen alignFrozen="right" />
            <Column field="hour_ratio" header="Break Time" style={{ width: '10rem' }} frozen alignFrozen="right" />
            <Column field="efficiency_count" header="Efficiency Count" style={{ width: '12rem' }} frozen alignFrozen="right" />
            <Column field="efficiency_summary_count" header="Efficiency Summary" style={{ width: '14rem' }} frozen alignFrozen="right" />
            <Column field="efficiency_target" header="Target" style={{ width: '9rem' }} frozen alignFrozen="right" />
            <Column
              field="efficiency"
              header="Efficiency"
              body={(data) => `${data.efficiency}%`}
              style={{ width: '9rem' }}
              frozen
              alignFrozen="right"
            />
          </DataTable>
        </TabPanel>
      </TabView>
    </>
  );
};

export default DailyProductionOutputsPage;
