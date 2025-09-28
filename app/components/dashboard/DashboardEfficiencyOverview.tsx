'use client';

import { Chart } from 'primereact/chart';
import { ChartData, ChartOptions } from 'chart.js';
import { DashboardMonthlyEfficiency, DashboardWeeklyEfficiency, DashboardYearlyEfficiency } from '@/app/types/dashboard';
import { endOfWeek, formatDate, startOfWeek } from 'date-fns';
import { getListOfYearOptions } from '@/app/utils';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { SelectItem } from 'primereact/selectitem';
import { Skeleton } from 'primereact/skeleton';
import { TabPanel, TabView } from 'primereact/tabview';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import FormDropdown from '../form/dropdown/component';
import FormMonthCalendar from '../form/month-calendar/component';
import FormRangeCalendar from '../form/range-calendar/component';

interface DashboardStatisticsProps {
  valueYear?: DashboardYearlyEfficiency[];
  valueMonth?: DashboardMonthlyEfficiency[];
  valueWeek?: DashboardWeeklyEfficiency[];
  onYearlyChange?: (year: number) => void;
  onMonthlyChange?: (year: number, month: number) => void;
  onWeeklyChange?: (from: Date, to: Date) => void;
  loading?: boolean;
}

const DashboardEfficiencyOverview = ({
  valueYear,
  valueMonth,
  valueWeek,
  loading,
  onYearlyChange,
  onMonthlyChange,
  onWeeklyChange
}: DashboardStatisticsProps) => {
  const { layoutConfig } = useContext(LayoutContext);
  const [yearOptions] = useState<SelectItem[]>(getListOfYearOptions());
  const [selectedYear, setSelectedYear] = useState<any>(new Date().getFullYear());
  const [activeIndex, setActiveIndex] = useState(0);
  const [lineOptions, setLineOptions] = useState<ChartOptions>({});
  const [monthDate, setMonthDate] = useState<Date | null>(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([startOfWeek(new Date(), { weekStartsOn: 1 }), endOfWeek(new Date(), { weekStartsOn: 1 })]);

  const applyLightTheme = () => {
    const lineOptions: ChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };

    setLineOptions(lineOptions);
  };

  const yearData = useMemo<ChartData>(() => {
    const labels: string[] = [];
    const datasets: number[] = [];
    (valueYear ?? []).forEach((eff) => {
      labels.push(eff.month_name);
      datasets.push(Number(eff.avg_efficiency) || 0); // ensure number
    });

    return {
      labels: labels,
      datasets: [
        {
          label: `Yearly Production Efficiency`,
          data: datasets,
          fill: false,
          backgroundColor: '#2f4860',
          borderColor: '#2f4860',
          tension: 0.4
        }
      ]
    };
  }, [valueYear]);

  const monthData = useMemo<ChartData>(() => {
    const labels: string[] = [];
    const datasets: number[] = [];
    (valueMonth ?? []).forEach((eff) => {
      labels.push(eff.day_name);
      datasets.push(Number(eff.avg_efficiency) || 0); // ensure number
    });

    return {
      labels: labels,
      datasets: [
        {
          label: `Monthly Production Efficiency`,
          data: datasets,
          fill: false,
          backgroundColor: '#2f4860',
          borderColor: '#2f4860',
          tension: 0.4
        }
      ]
    };
  }, [valueMonth]);

  const weekData = useMemo<ChartData>(() => {
    const labels: string[] = [];
    const datasets: number[] = [];
    (valueWeek ?? []).forEach((eff) => {
      labels.push(eff.day_name);
      datasets.push(Number(eff.avg_efficiency) || 0); // ensure number
    });

    return {
      labels: labels,
      datasets: [
        {
          label: `Weekly Production Efficiency`,
          data: datasets,
          fill: false,
          backgroundColor: '#2f4860',
          borderColor: '#2f4860',
          tension: 0.4
        }
      ]
    };
  }, [valueWeek]);

  const applyDarkTheme = () => {
    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)'
          }
        },
        y: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)'
          }
        }
      }
    };

    setLineOptions(lineOptions);
  };

  useEffect(() => {
    if (layoutConfig.colorScheme === 'light') {
      applyLightTheme();
    } else {
      applyDarkTheme();
    }
  }, [layoutConfig.colorScheme]);

  const handleChangeSetWeek = (e: any) => {
    const selectedDate = e.value as Date;
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 }); // Sunday
    setWeekDates([start, end]);
    if (onWeeklyChange) onWeeklyChange(start, end);
  };

  const handleYearlyChange = (option: any) => {
    setSelectedYear(option.value);
    if (onYearlyChange) onYearlyChange(option.value);
  };

  const handleMonthlyChange = (e: any) => {
    const date = e.value as Date;
    setMonthDate(date);
    if (onMonthlyChange) onMonthlyChange(date.getFullYear(), date.getMonth() + 1);
  };

  return (
    <div className="card">
      <div className="flex align-items-center justify-content-between">
        <h5 className="flex align-content-center gap-2 mb-0">Efficiency Overview</h5>
        {activeIndex == 0 && (
          <FormDropdown
            value={selectedYear}
            onChange={handleYearlyChange}
            className="mb-0"
            filter={true}
            placeholder="Select Year"
            options={yearOptions}
          />
        )}
        {activeIndex == 1 && (
          <>
            <FormMonthCalendar value={monthDate} onChange={handleMonthlyChange} placeholder="Select a Month" readOnlyInput showIcon />
          </>
        )}
        {activeIndex == 2 && (
          <FormRangeCalendar
            value={weekDates}
            onChange={handleChangeSetWeek}
            placeholder="Select a Week"
            readOnlyInput
            showIcon
            hideOnRangeSelection
          />
        )}
      </div>
      {loading ? (
        <Skeleton width="100%" height="150px"></Skeleton>
      ) : (
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          <TabPanel header="Yearly" leftIcon="pi pi-calendar mr-2">
            <Chart type="line" data={yearData} options={lineOptions} />
          </TabPanel>
          <TabPanel header="Monthly" leftIcon="pi pi-calendar mr-2">
            <Chart type="line" data={monthData} options={lineOptions} />
          </TabPanel>
          <TabPanel header="Weekly" leftIcon="pi pi-calendar mr-2">
            <Chart type="line" data={weekData} options={lineOptions} />
          </TabPanel>
        </TabView>
      )}
    </div>
  );
};

export default DashboardEfficiencyOverview;
