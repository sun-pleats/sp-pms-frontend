'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DatatableFilters } from '@/app/types/datatable';
import { endOfWeek, startOfWeek } from 'date-fns';
import { formatDbDate, roundToDecimal } from '@/app/utils';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { SectionDailyProcessOutput } from '@/app/types/reports';
import { ReportService } from '@/app/services/ReportService';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import CustomDatatable from '@/app/components/datatable/component';
import FormMultiDropdown from '@/app/components/form/multi-dropdown/component';
import FormRangeCalendar from '@/app/components/form/range-calendar/component';
import PageTile from '@/app/components/page-title/component';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import useDatatable from '@/app/hooks/useDatatable';
import useUtilityData from '@/app/hooks/useUtilityData';
import DateSelectors from '@/app/components/date-selector/component';

interface SearchFilter extends DatatableFilters {
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

const hours = [
  '12AM',
  '1AM',
  '2AM',
  '3AM',
  '4AM',
  '5AM',
  '6AM',
  '7AM',
  '8AM',
  '9AM',
  '10AM',
  '11AM',
  '12PM',
  '1PM',
  '2PM',
  '3PM',
  '4PM',
  '5PM',
  '6PM',
  '7PM',
  '8PM',
  '9PM',
  '10PM',
  '11PM'
];

type HourKey =
  | '12AM'
  | '1AM'
  | '2AM'
  | '3AM'
  | '4AM'
  | '5AM'
  | '6AM'
  | '7AM'
  | '8AM'
  | '9AM'
  | '10AM'
  | '11AM'
  | '12PM'
  | '1PM'
  | '2PM'
  | '3PM'
  | '4PM'
  | '5PM'
  | '6PM'
  | '7PM'
  | '8PM'
  | '9PM'
  | '10PM'
  | '11PM';

const SectionHourlyEfficiencyPage = () => {
  const [dailySectionOutputs, setSectionHourlyEfficiency] = useState<SectionDailyProcessOutput[]>([]);

  const [loadings, setLoadings] = useState<Loadings>({});
  const [filter, setFilter] = useState<SearchFilter>({
    dates: [
      startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday
      endOfWeek(new Date(), { weekStartsOn: 1 }) // Sunday
    ]
  });
  const [sectionOptions, setSectionOptions] = useState<SelectItem[]>();
  const { fetchSectionSelectOption } = useUtilityData();
  const { showApiError, showSuccess } = useContext(LayoutContext);

  const { setFirst, setRows, first, rows, setTotalRecords, totalRecords } = useDatatable();

  useEffect(() => {
    initData();
  }, []);

  const initData = () => {
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

  const handleOnPageChange = (e: any) => {
    setFilter({ ...filter, page: e.page + 1, per_page: e.rows });
    setFirst(e.first);
    setRows(e.rows);
  };

  const fetchSectionHourlyEfficiency = useCallback(async () => {
    setLoadings({ ...loadings, fetchingOutputs: true });
    const params = {
      page: filter.page,
      per_page: filter.per_page,
      ...filter,
      dates: filter.dates?.flatMap((date) => formatDbDate(date))
    };
    const { data } = await ReportService.getSectionDailyOutput(params);
    setSectionHourlyEfficiency(data.data ?? []);
    setTotalRecords(data.total ?? 0);
    setLoadings({ ...loadings, fetchingOutputs: false });
  }, [filter]);

  useEffect(() => {
    fetchSectionHourlyEfficiency();
  }, [fetchSectionHourlyEfficiency]);

  const onExportExcelClick = async () => {
    try {
      setLoadings({ exporting: true });
      const response = await ReportService.exportSectionDailyOutput({ ...filter, dates: filter.dates?.flatMap((date) => formatDbDate(date)) });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'daily_section_output.xlsx');
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

  const hourCellTemplate = (hour: HourKey) => (row: SectionDailyProcessOutput) => {
    const target = row[`TARGET_${hour}` as const];
    const output = row[`OUTPUT_${hour}` as const];
    const efficiency = row[`EFFICIENY_${hour}` as const];

    return (
      <div className="hour-cell">
        <div className="hour-line target">{target ?? ''}</div>
        <div className="hour-line output">{output ?? ''}</div>
        <div className="hour-line efficiency">{efficiency != null ? `${efficiency}%` : ''}</div>
      </div>
    );
  };

  const targetActualTemplate = (row: SectionDailyProcessOutput) => {
    // all rows that belong to the same style/section + date
    const rows = dailySectionOutputs.filter((r) => r.id === row.id && r.log_date === row.log_date);

    type TargetKey = `TARGET_${HourKey}`;
    type OutputKey = `OUTPUT_${HourKey}`;

    const totalTarget = rows.reduce((sum, r) => {
      const rowTarget = hours.reduce((innerSum, h) => {
        const key = `TARGET_${h}` as TargetKey;
        const val = Number(r[key] ?? 0);
        return innerSum + (val || 0);
      }, 0);
      return sum + rowTarget;
    }, 0);

    const totalOutput = rows.reduce((sum, r) => {
      const rowOutput = hours.reduce((innerSum, h) => {
        const key = `OUTPUT_${h}` as OutputKey;
        const val = Number(r[key] ?? 0);
        return innerSum + (val || 0);
      }, 0);
      return sum + rowOutput;
    }, 0);

    const efficiency = totalTarget > 0 ? Math.round((totalTarget / totalOutput) * 100) : null;

    return (
      <div className="hour-cell">
        <div className="hour-line target">{roundToDecimal(totalTarget, 1) || ''}</div>
        <div className="hour-line output">{roundToDecimal(totalOutput, 1) || ''}</div>
        <div className="hour-line efficiency">{efficiency != null ? `${roundToDecimal(efficiency, 1)}%` : ''}</div>
      </div>
    );
  };

  return (
    <>
      <PageTile title="Section Hourly Efficiency" icon="pi pi-fw pi-clock" url={ROUTES.REPORTS.SECTION_HOURLY_EFFICIENCY.INDEX} />
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
        onDateSelected={(dates: Date[] | null) => {
          if (dates) setFilter({ ...filter, dates });
          else setFilter({ ...filter, dates: undefined });
        }}
      />
      <CustomDatatable
        value={dailySectionOutputs}
        loading={loadings.fetchingOutputs}
        onPage={handleOnPageChange}
        first={first}
        rows={rows}
        totalRecords={totalRecords}
      >
        <Column field="id" header="ID" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} alignFrozen="left" frozen />
        <Column
          field="name"
          headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }}
          header="Section"
          style={{ minWidth: '12rem' }}
          alignFrozen="left"
          frozen
        />
        <Column
          field="style_number"
          headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }}
          header="Style No."
          style={{ minWidth: '12rem' }}
          alignFrozen="left"
          frozen
        />
        <Column
          field="pleats_name"
          headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }}
          header="Style Name"
          style={{ minWidth: '12rem' }}
          alignFrozen="left"
          frozen
        />
        <Column
          field="buyer_name"
          headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }}
          header="Buyer"
          style={{ minWidth: '12rem' }}
          alignFrozen="left"
          frozen
        />
        <Column field="log_date" headerStyle={{ width: 'auto', whiteSpace: 'nowrap' }} header="Date" style={{ minWidth: '12rem' }} />

        {/* “TARGET / OUTPUT” label column */}
        <Column
          header="TARGET / OUTPUT"
          body={() => (
            <div className="hour-cell">
              <div className="hour-line target">TARGET</div>
              <div className="hour-line output">OUTPUT</div>
              <div className="hour-line efficiency">EFFICIENCY</div>
            </div>
          )}
        />

        {/* Dynamic hour columns */}
        {hours.map((h, index) => (
          <Column key={`${h}${index}`} header={h} body={hourCellTemplate(h as HourKey)} />
        ))}

        {/* Right-side summary columns – you can compute these in your API or front-end */}
        <Column header="CURRENT TARGET / ACTUAL" body={targetActualTemplate} />
        <Column
          header="TOTAL TARGET / ACTUAL"
          body={(row: SectionDailyProcessOutput) => {
            return <span>{/* your value here */}</span>;
          }}
        />
      </CustomDatatable>
    </>
  );
};

export default SectionHourlyEfficiencyPage;
