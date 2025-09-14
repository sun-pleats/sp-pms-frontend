'use client';

import { DashboardYearlyEfficiency } from '@/app/types/dashboard';
import { Chart } from 'primereact/chart';
import { ChartData, ChartOptions } from 'chart.js';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';
import FormDropdown from '../form/dropdown/component';
import { SelectItem } from 'primereact/selectitem';

interface DashboardStatisticsProps {
  value?: DashboardYearlyEfficiency[];
  year?: number;
  loading?: boolean;
  loadingSections?: boolean;
  sectionOptions?: SelectItem[];
  sectionId?: number;
  onSectionChange?: (item: SelectItem) => void;
}

const DashboardEfficiencyOverviewBySection = ({
  value,
  year,
  loading,
  sectionId,
  sectionOptions,
  loadingSections,
  onSectionChange
}: DashboardStatisticsProps) => {
  const { layoutConfig } = useContext(LayoutContext);
  const [lineOptions, setLineOptions] = useState<ChartOptions>({});
  const [selectedSection, setSelectedSection] = useState<any>();

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

  useEffect(() => {
    if (sectionId) setSelectedSection(sectionId);
  }, [sectionId]);

  const handleSectionChange = (item: SelectItem) => {
    if (onSectionChange) onSectionChange(item);
  };

  return (
    <div className="card">
      <div className="flex align-items-center justify-content-between mb-4">
        <h5>
          Efficiency By Section <Tag severity="success" value="Yearly"></Tag>
        </h5>
        <div>
          <FormDropdown
            loading={loadingSections}
            value={selectedSection}
            onChange={handleSectionChange}
            filter={true}
            placeholder="Select Section"
            options={sectionOptions}
          />
        </div>
      </div>
      {loading ? <Skeleton width="100%" height="150px"></Skeleton> : <Chart type="line" data={lineData} options={lineOptions} />}
    </div>
  );
};

export default DashboardEfficiencyOverviewBySection;
