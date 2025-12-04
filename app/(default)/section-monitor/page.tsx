'use client';

import './page.scss';
import { formatDbDate, roundToDecimal } from '@/app/utils';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ProductionDailyOutput } from '@/app/types/reports';
import { ReportService } from '@/app/services/ReportService';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import FormMultiDropdown from '@/app/components/form/multi-dropdown/component';
import OperatorPerformanceCard from '@/app/components/reports/operator-performance-card/OperatorPerformanceCard';
import PageTile from '@/app/components/page-title/component';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useUtilityData from '@/app/hooks/useUtilityData';
import { DatatableFilters } from '@/app/types/datatable';
import FormCalendar from '@/app/components/form/calendar/component';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { LOCALSTORAGE_KEYS } from '@/app/constants/local-storage';
import useLocalStorage from '@/app/hooks/useLocalStorage';
import { setInterval } from 'timers';

interface SearchFilter extends DatatableFilters {
  keyword?: string;
  section_ids?: number[];
  process_ids?: string[];
  dates?: Date;
  operator_ids?: string[];
}

interface Loadings {
  fetchingSections?: boolean;
  fetchingOutputs?: boolean;
  exporting?: boolean;
}

const DailyProductionOutputsPage = () => {
  const [cardDailyProductionOutputs, setCardDailyProductionOutputs] = useState<ProductionDailyOutput[]>([]);
  const [storedSection, setStoredSection] = useLocalStorage<number[]>(LOCALSTORAGE_KEYS.section_monitor.section, []);
  const [isListenFilters, setIsListenFilters] = useState<boolean>(true);

  const [loadings, setLoadings] = useState<Loadings>({
    fetchingSections: false
  });
  const [filter, setFilter] = useState<SearchFilter>({
    dates: new Date()
  });

  const [sectionOptions, setSectionOptions] = useState<SelectItem[]>();
  const [refetch, setRefetch] = useState<boolean>(false);

  const { fetchSectionSelectOption } = useUtilityData();
  const { showApiError } = useContext(LayoutContext);

  const router = useRouter();

  const avgEff = useMemo(
    () =>
      roundToDecimal(
        cardDailyProductionOutputs.length ==0 ? 0 : (cardDailyProductionOutputs.map((o) => o.efficiency).reduce((sum, val) => sum + val, 0) || 0) / cardDailyProductionOutputs.length,
        2
      ),
    [cardDailyProductionOutputs]
  );

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    if (storedSection) {
      setIsListenFilters(false);
      setFilter({ ...filter, section_ids: [...storedSection] });
      setTimeout(() => {
        setIsListenFilters(true);
      }, 2000);
    }
  }, [storedSection]);

  useEffect(() => {
    if (filter.section_ids && filter.section_ids.length !== 0 && isListenFilters) setStoredSection(filter.section_ids.flatMap((r) => Number(r)));
  }, [filter.section_ids]);

  const initData = () => {
    setLoadings({ fetchingSections: true });

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

  const fetchDailyProductionOutputsNoLimit = useCallback(async () => {
    setLoadings({ ...loadings, fetchingOutputs: true });
    const params = {
      ...filter,
      dates: [formatDbDate(filter.dates), formatDbDate(filter.dates)]
    };
    const { data } = await ReportService.getAllProductionDailyOutput(params);
    setCardDailyProductionOutputs(data ?? []);
    setLoadings({ ...loadings, fetchingOutputs: false });
  }, [filter]);

  useEffect(() => {
    fetchDailyProductionOutputsNoLimit();
  }, [fetchDailyProductionOutputsNoLimit]);

  useEffect(() => {
    if (refetch) fetchDailyProductionOutputsNoLimit();
  }, [refetch]);

  useEffect(() => {
    setInterval(() => {
      setRefetch(false);
      setTimeout(() => {
        setRefetch(true);
      }, 3000);
    }, 60000);
  }, []);

  return (
    <div className="gradient-bg p-5">
      <div className="card">
        <PageTile title="Sewing Line Monitoring" icon="pi pi-fw pi-clock" />

        <div className="flex flex-align-items-center">
          <div className="flex flex-align-items-center mr-2">
            <div className="flex align-items-center gap-2">
              <FormCalendar
                value={filter.dates}
                onChange={(e: any) => setFilter({ ...filter, dates: e.value })}
                label="Operation Date"
                readOnlyInput
              />

              <FormMultiDropdown
                label="Section"
                value={filter.section_ids}
                loading={loadings.fetchingSections}
                onChange={(option: SelectItem) => setFilter({ ...filter, section_ids: option.value })}
                filter={true}
                placeholder="Select"
                options={sectionOptions}
              />
              <Button label="Home" icon="pi pi-home" className="mt-2" onClick={() => router.push('/')}></Button>
              <Button label="Kiosk" icon="pi pi-desktop" className="mt-2" onClick={() => router.push('/kiosk')}></Button>
            </div>
          </div>
          <div className="ml-auto">
            <h1>
              <i className="pi pi-arrow-down text-red-500 text-lg"></i>
              <i className="pi pi-arrow-up text-green-500 text-lg"></i> AVG Efficiency {avgEff}%
            </h1>
          </div>
        </div>
        <p className="text-sm text-gray-500">Refetching records every 1 minute...</p>
      </div>
      <OperatorPerformanceCard loading={loadings.fetchingOutputs} outputs={cardDailyProductionOutputs} />
    </div>
  );
};

export default DailyProductionOutputsPage;
