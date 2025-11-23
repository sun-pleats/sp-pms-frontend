'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { EMPTY_TABLE_MESSAGE } from '@/app/constants';
import { currentMonthDates, formatDbDate, getMonthName } from '@/app/utils';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ProductionMonthlyEfficiency } from '@/app/types/reports';
import { ReportService } from '@/app/services/ReportService';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import FormMultiDropdown from '@/app/components/form/multi-dropdown/component';
import FormRangeCalendar from '@/app/components/form/range-calendar/component';
import PageTile from '@/app/components/page-title/component';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import useUtilityData from '@/app/hooks/useUtilityData';
import DateSelectors from '@/app/components/date-selector/component';

interface SearchFilter {
  keyword?: string;
  section_ids?: string[];
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

const ProductionMonthlyEfficiencyPage = () => {
  const [productionMonthlyEfficiency, setProductionMonthlyEfficiency] = useState<ProductionMonthlyEfficiency[]>([]);
  const [loadings, setLoadings] = useState<Loadings>({});
  const [filter, setFilter] = useState<SearchFilter>({
    dates: currentMonthDates()
  });
  const [sectionOptions, setSectionOptions] = useState<SelectItem[]>();
  const [operatorOptions, setOperatorOptions] = useState<SelectItem[]>([]);
  const { fetchOperatorOptions, fetchSectionSelectOption } = useUtilityData();
  const { showApiError, showSuccess } = useContext(LayoutContext);

  useEffect(() => {
    initData();
  }, []);

  const initData = () => {
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

  const fetchProductionMonthlyEfficiency = useCallback(async () => {
    setLoadings({ ...loadings, fetchingOutputs: true });
    const data = await ReportService.getProductionMonthlyEfficiency({ ...filter, dates: filter.dates?.flatMap((date) => formatDbDate(date)) });
    setProductionMonthlyEfficiency(data.data.data ?? []);
    setLoadings({ ...loadings, fetchingOutputs: false });
  }, [filter]);

  useEffect(() => {
    fetchProductionMonthlyEfficiency();
  }, [fetchProductionMonthlyEfficiency]);

  const onExportExcelClick = async () => {
    try {
      setLoadings({ exporting: true });
      const response = await ReportService.exportProductionMonthlyEfficiency({
        ...filter,
        dates: filter.dates?.flatMap((date) => formatDbDate(date))
      });
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
      <PageTile title="Monthly Efficiency Report" icon="pi pi-fw pi-chart-bar" url={ROUTES.REPORTS.PRODUCTION_DAILY_OUTPUT.INDEX} />
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

      <DateSelectors
        className="mb-2"
        onlyMonths
        onDateSelected={(dates: Date[] | null) => {
          if (dates) setFilter({ ...filter, dates });
          else setFilter({ ...filter, dates: undefined });
        }}
      />

      <DataTable
        value={productionMonthlyEfficiency}
        paginator
        className="custom-table p-datatable-gridlines"
        showGridlines
        rows={10}
        dataKey="id"
        filterDisplay="menu"
        loading={loadings.fetchingOutputs}
        emptyMessage={EMPTY_TABLE_MESSAGE}
      >
        <Column field="operator_name" header="Operator" style={{ minWidth: '12rem' }} />
        <Column field="section_name" header="Section" style={{ minWidth: '12rem' }} />
        <Column field="month" header="Month" body={(data) => getMonthName(data.month)} style={{ width: '9rem' }} frozen alignFrozen="right" />
        <Column field="year" header="Year" style={{ minWidth: '12rem' }} />
        <Column
          field="avg_efficiency"
          header="Efficiency"
          body={(data) => `${data.avg_efficiency}%`}
          style={{ width: '9rem' }}
          frozen
          alignFrozen="right"
        />
      </DataTable>
    </>
  );
};

export default ProductionMonthlyEfficiencyPage;
