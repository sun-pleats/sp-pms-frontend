'use client';

import { DashboardYearlyEfficiency } from '@/app/types/dashboard';
import { Chart } from 'primereact/chart';
import { ChartData, ChartOptions } from 'chart.js';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';

interface DashboardStatisticsProps {
  value?: DashboardYearlyEfficiency[];
  year?: number;
  loading?: boolean;
}

const DashboardEfficiencyOverview = ({ value, year, loading }: DashboardStatisticsProps) => {
  const { layoutConfig } = useContext(LayoutContext);
  const [lineOptions, setLineOptions] = useState<ChartOptions>({});
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

  const lineData = useMemo<ChartData>(() => {
    const labels: string[] = [];
    const datasets: number[] = [];
    (value ?? []).forEach((eff) => {
      labels.push(eff.month_name);
      datasets.push(Number(eff.avg_efficiency) || 0); // ensure number
    });

    return {
      labels: labels,
      datasets: [
        {
          label: `Production Efficiency ${year ?? ''}`,
          data: datasets,
          fill: false,
          backgroundColor: '#2f4860',
          borderColor: '#2f4860',
          tension: 0.4
        }
      ]
    };
  }, [value]);

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

  return (
    <div className="card">
      <h5 className="flex align-content-center gap-2">
        Efficiency Overview <Tag severity="success" value="Yearly"></Tag>
      </h5>
      {loading ? <Skeleton width="100%" height="150px"></Skeleton> : <Chart type="line" data={lineData} options={lineOptions} />}
    </div>
  );
};

export default DashboardEfficiencyOverview;
