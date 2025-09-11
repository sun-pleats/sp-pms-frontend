'use client';

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { EMPTY_TABLE_MESSAGE } from '@/app/constants';
import { ProductionDailyOutput } from '@/app/types/reports';
import { ReportService } from '@/app/services/ReportService';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import FormMultiDropdown from '@/app/components/form/multi-dropdown/component';
import PageTile from '@/app/components/page-title/component';
import React, { useCallback, useEffect, useState } from 'react';
import useUtilityData from '@/app/hooks/useUtilityData';
import FormCalendar from '@/app/components/form/calendar/component';

interface SearchFilter {
  keyword?: string;
  section_ids?: string[];
  process_ids?: string[];
  date?: string | Date;
  operator_ids?: string[];
}

interface Loadings {
  fetchingProcesses?: boolean;
  fetchingOperator?: boolean;
  fetchingSections?: boolean;
  fetchingOutputs?: boolean;
}

const DailyProductionOutputsPage = () => {
  const [DailyProductionOutputs, setDailyProductionOutputs] = useState<ProductionDailyOutput[]>([]);
  const [loadings, setLoadings] = useState<Loadings>({});
  const [filter, setFilter] = useState<SearchFilter>({
    date: new Date()
  });
  const [processOptions, setProcessOptions] = useState<SelectItem[]>();
  const [sectionOptions, setSectionOptions] = useState<SelectItem[]>();
  const [operatorOptions, setOperatorOptions] = useState<SelectItem[]>([]);
  const { fetchProcessOptions, fetchOperatorOptions, fetchSectionSelectOption } = useUtilityData();

  useEffect(() => {
    initData();
  }, []);

  const initData = () => {
    // Fetch processes
    fetchProcessOptions()
      .then((data) => {
        setProcessOptions(data);
      })
      .finally(() => setLoadings({ fetchingProcesses: false }));

    // Fetch processes
    fetchOperatorOptions()
      .then((data) => {
        setOperatorOptions(data);
      })
      .finally(() => setLoadings({ fetchingOperator: false }));

    // Fetch sections
    fetchSectionSelectOption()
      .then((data) => {
        setSectionOptions(data);
      })
      .finally(() =>
        setTimeout(() => {
          setLoadings({ fetchingSections: false });
        }, 1000)
      );
  };

  const fetchDailyProductionOutputs = useCallback(async () => {
    setLoadings({ ...loadings, fetchingOutputs: true });
    const data = await ReportService.getProductionDailyOutput({ ...filter });
    setDailyProductionOutputs(data.data.data ?? []);
    setLoadings({ ...loadings, fetchingOutputs: false });
  }, [filter]);

  useEffect(() => {
    fetchDailyProductionOutputs();
  }, [fetchDailyProductionOutputs]);

  return (
    <>
      <PageTile title="Daily Production Outputs" icon="pi pi-fw pi-sitemap" url={ROUTES.REPORTS.PRODUCTION_DAILY_OUTPUT.INDEX} />

      <div className="flex flex-align-items-center">
        <div className="flex flex-align-items-center mr-2">
          <div className="flex align-items-center gap-2">
            <FormCalendar value={filter.date} onChange={(e: any) => setFilter({ ...filter, date: e.value })} label="Operation Date" />

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
          </div>
        </div>
      </div>
      <DataTable
        value={DailyProductionOutputs}
        paginator
        className="p-datatable-gridlines"
        showGridlines
        rows={10}
        dataKey="id"
        filterDisplay="menu"
        loading={loadings.fetchingOutputs}
        emptyMessage={EMPTY_TABLE_MESSAGE}
      >
        <Column field="id" header="ID" style={{ minWidth: '12rem' }} />
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
        <Column field="total_output" header="Total Output" alignFrozen="right" frozen={true} />
        <Column field="hour_ratio" header="Break Time" alignFrozen="right" frozen={true} />
        <Column field="efficiency_count" header="Efficiency Count" alignFrozen="right" frozen={true} />
        <Column field="efficiency_summary_count" header="Efficiency Summary Count" alignFrozen="right" frozen={true} />
        <Column field="efficiency_target" header="Target" alignFrozen="right" frozen={true} />
        <Column field="efficiency" header="Efficiency" alignFrozen="right" frozen={true} />
      </DataTable>
    </>
  );
};

export default DailyProductionOutputsPage;
