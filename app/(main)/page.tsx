'use client';

import { useDashboard } from './(dashboard)/useDashboard';
import DashboardEfficiencyOverview from '../components/dashboard/DashboardEfficiencyOverview';
import DashboardStatistics from '../components/dashboard/DashboardStatistics';
import React from 'react';
import DashboardOperatorPerformer from '../components/dashboard/DashboardOperatorPerformer';
import DashboardRecentBundles from '../components/dashboard/DashboardRecentBundles';
import DashboardEfficiencyOverviewBySection from '../components/dashboard/DashboardEfficiencyOverviewBySection';
import { SelectItem } from 'primereact/selectitem';

const Dashboard = () => {
  const {
    stats,
    yearlyEfficiency,
    pageFilter,
    recentBundles,
    isFetchingRecentBundles,
    isFetchingStats,
    isFetchingYearlyEfficiency,
    isFetchingOperatorEff,
    isFetchingSections,
    sectionOptions,
    selectedSection,
    operatorEfficiency,
    setSelectedSection,
    yearlyEfficiencyBySection,
    isFetchingYearlyEfficiencyBySection
  } = useDashboard();

  const handleSectionChange = (item: SelectItem) => {
    setSelectedSection(item.value);
  };

  return (
    <>
      <div className="grid">
        <DashboardStatistics loading={isFetchingStats} value={stats} />
        <div className="col-12 xl:col-6">
          <DashboardRecentBundles loading={isFetchingRecentBundles} value={recentBundles} />
          <DashboardOperatorPerformer loading={isFetchingOperatorEff} value={operatorEfficiency} />
        </div>
        <div className="col-12 xl:col-6">
          <DashboardEfficiencyOverview loading={isFetchingYearlyEfficiency} year={pageFilter.year} value={yearlyEfficiency} />
          <DashboardEfficiencyOverviewBySection
            sectionOptions={sectionOptions}
            sectionId={selectedSection}
            loadingSections={isFetchingSections}
            loading={isFetchingYearlyEfficiencyBySection || isFetchingSections}
            year={pageFilter.year}
            value={yearlyEfficiencyBySection}
            onSectionChange={handleSectionChange}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
