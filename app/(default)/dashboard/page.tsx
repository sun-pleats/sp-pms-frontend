'use client';

import './page.scss';
import React, { useCallback, useEffect, useState } from 'react';
import DashboardTable from '@/app/components/dashboard/DashboardTable';
import { MachinePleatsDashboard } from '@/app/types/dashboard';
import DashboardService from '@/app/services/DashboardService';

interface StyleDetail {
  name: string;
  value: string;
}

const LandingPage = () => {
  const [dashboard, setDashboard] = useState<MachinePleatsDashboard[]>([]);

  const fetchMachinePleatsStats = useCallback(async () => {
    const { data } = await DashboardService.fetchMachinePleatsStats();
    setDashboard(data);
  }, []);

  useEffect(() => {
    fetchMachinePleatsStats();
  }, [fetchMachinePleatsStats]);

  return (
    <div className="gradient-bg">
      <div className="w-full">
        <DashboardTable buyers={dashboard} />
      </div>
    </div>
  );
};

export default LandingPage;
