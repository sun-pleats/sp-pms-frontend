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
import { TabPanel, TabView } from 'primereact/tabview';
import FormMultiDropdown from '@/app/components/form/multi-dropdown/component';
import FormRangeCalendar from '@/app/components/form/range-calendar/component';
import OperatorPerformanceCard from '@/app/components/reports/operator-performance-card/OperatorPerformanceCard';
import PageTile from '@/app/components/page-title/component';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import useUtilityData from '@/app/hooks/useUtilityData';

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
      <PageTile title="Daily Production Outputs" icon="pi pi-fw pi-clock" url={ROUTES.REPORTS.PRODUCTION_DAILY_OUTPUT.INDEX} />
      <div className="flex flex-align-items-center">
        <div className="flex flex-align-items-center mr-2">
          <div className="flex align-items-center gap-2">
            <FormRangeCalendar
              value={filter.dates}
              onChange={(e: any) => setFilter({ ...filter, dates: e.value })}
              label="Operation Date"
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
            className="custom-table p-datatable-gridlines"
            showGridlines
            rows={10}
            dataKey="id"
            filterDisplay="menu"
            loading={loadings.fetchingOutputs}
            emptyMessage={EMPTY_TABLE_MESSAGE}
            scrollable
          >
            <Column field="id" header="ID" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} />
            <Column field="operator_name" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Operator" style={{ minWidth: '12rem' }} />
            <Column field="process_name" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Process" style={{ minWidth: '12rem' }} />
            <Column field="log_date" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Date" style={{ minWidth: '12rem' }} />
            <Column field="12AM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="12AM" />
            <Column field="1AM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="1AM" />
            <Column field="2AM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="2AM" />
            <Column field="3AM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="3AM" />
            <Column field="4AM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="4AM" />
            <Column field="5AM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="5AM" />
            <Column field="6AM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="6AM" />
            <Column field="7AM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="7AM" />
            <Column field="8AM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="8AM" />
            <Column field="9AM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="9AM" />
            <Column field="10AM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="10AM" />
            <Column field="11AM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="11AM" />
            <Column field="12PM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="12PM" />
            <Column field="1PM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="1PM" />
            <Column field="3PM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="3PM" />
            <Column field="4PM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="4PM" />
            <Column field="5PM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="5PM" />
            <Column field="6PM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="6PM" />
            <Column field="7PM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="7PM" />
            <Column field="8PM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="8PM" />
            <Column field="9PM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="9PM" />
            <Column field="10PM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="10PM" />
            <Column field="11PM" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="11PM" />
            <Column field="total_output" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Total Output" />
            <Column field="hour_ratio" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Break Time" />
            <Column field="efficiency_count" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Efficiency Count" />
            <Column field="efficiency_summary_count" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Efficiency Summary" />
            <Column field="efficiency_target" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Target" frozen alignFrozen="right" />
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
