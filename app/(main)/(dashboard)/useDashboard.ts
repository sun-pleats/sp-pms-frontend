import useUtilityData from '@/app/hooks/useUtilityData';
import DashboardService from '@/app/services/DashboardService';
import { DashboardOperatorEfficiency, DashboardStats, DashboardYearlyEfficiency } from '@/app/types/dashboard';
import { StyleBundle } from '@/app/types/styles';
import moment from 'moment';
import { SelectItem } from 'primereact/selectitem';
import { useCallback, useEffect, useState } from 'react';

interface PageFilter {
  year: number;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({});
  const [yearlyEfficiency, setYearlyEfficiency] = useState<DashboardYearlyEfficiency[]>([]);
  const [operatorEfficiency, setOperatorEfficiency] = useState<DashboardOperatorEfficiency[]>([]);
  const [yearlyEfficiencyBySection, setYearlyEfficiencyBySection] = useState<DashboardYearlyEfficiency[]>([]);
  const [selectedSection, setSelectedSection] = useState<any>();
  const [sectionOptions, setSectionOptions] = useState<SelectItem[]>([]);

  const [isFetchingRecentBundles, setIsFetchingRecentBundles] = useState<boolean>(false);
  const [isFetchingStats, setIsFetchingStats] = useState<boolean>(false);
  const [isFetchingYearlyEfficiency, setIsFetchingYearlyEfficiency] = useState<boolean>(false);
  const [isFetchingYearlyEfficiencyBySection, setIsFetchingYearlyEfficiencyBySection] = useState<boolean>(false);
  const [isFetchingOperatorEff, setIsFetchingOperatorEff] = useState<boolean>(false);
  const [isFetchingSections, setIsFetchingSections] = useState<boolean>(false);

  const [recentBundles, setRecentBundles] = useState<StyleBundle[]>([]);
  const [pageFilter, setPageFilter] = useState<PageFilter>({
    year: moment().year()
  });

  const { fetchSectionOptions } = useUtilityData();

  const fetchSections = useCallback(async () => {
    setIsFetchingSections(true);
    const options = await fetchSectionOptions();
    if (options.length) setSelectedSection(options[0].value); // Set default value
    setSectionOptions(options);
    setIsFetchingSections(false);
  }, []);

  const fetchOperatorEfficiency = useCallback(async () => {
    setIsFetchingOperatorEff(true);
    const { data } = await DashboardService.fetchOperatorEfficiency();
    setOperatorEfficiency(data);
    setIsFetchingOperatorEff(false);
  }, []);

  const fetchStatus = useCallback(async () => {
    setIsFetchingStats(true);
    const { data } = await DashboardService.fetchStats();
    setStats(data);
    setIsFetchingStats(false);
  }, []);

  const fetchRecentBundles = useCallback(async () => {
    setIsFetchingRecentBundles(true);
    const { data } = await DashboardService.fetchRecentBundles();
    setRecentBundles(data);
    setIsFetchingRecentBundles(false);
  }, []);

  const fetchYearlyEfficiency = useCallback(async () => {
    setIsFetchingYearlyEfficiency(true);
    const { data } = await DashboardService.fetchYearlyEfficiency(pageFilter.year);
    setYearlyEfficiency(data);
    setIsFetchingYearlyEfficiency(false);
  }, []);

  const fetchYearlyEfficiencyBySection = useCallback(async (section_id: number) => {
    setIsFetchingYearlyEfficiencyBySection(true);
    const { data } = await DashboardService.fetchYearlyEfficiency(pageFilter.year, section_id);
    setYearlyEfficiencyBySection(data);
    setIsFetchingYearlyEfficiencyBySection(false);
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  useEffect(() => {
    fetchRecentBundles();
  }, [fetchRecentBundles]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    fetchYearlyEfficiency();
  }, [fetchYearlyEfficiency]);

  useEffect(() => {
    if (selectedSection) fetchYearlyEfficiencyBySection(selectedSection);
  }, [fetchYearlyEfficiencyBySection, selectedSection]);

  useEffect(() => {
    fetchOperatorEfficiency();
  }, [fetchOperatorEfficiency]);

  return {
    stats,
    fetchRecentBundles,
    fetchStatus,
    fetchYearlyEfficiency,
    yearlyEfficiency,
    pageFilter,
    recentBundles,
    isFetchingRecentBundles,
    isFetchingStats,
    isFetchingYearlyEfficiency,
    isFetchingOperatorEff,
    operatorEfficiency,
    isFetchingSections,
    sectionOptions,
    selectedSection,
    setSelectedSection,
    yearlyEfficiencyBySection,
    fetchYearlyEfficiencyBySection,
    isFetchingYearlyEfficiencyBySection
  };
};
