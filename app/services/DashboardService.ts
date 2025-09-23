import apiClient from '../api/http-common';
import type { AxiosPromise } from 'axios';
import { DashboardOperatorEfficiency, DashboardStats, DashboardYearlyEfficiency, MachinePleatsDashboard } from '../types/dashboard';
import { StyleBundle } from '../types/styles';

const BASE_URL = '/api/dashboard';

class DashboardService {
  fetchStats(): AxiosPromise<DashboardStats> {
    return apiClient.get(`${BASE_URL}/stats`);
  }
  fetchYearlyEfficiency(year: number, section_id?: number): AxiosPromise<DashboardYearlyEfficiency[]> {
    return apiClient.get(`${BASE_URL}/yearly-efficiency`, { params: { year, section_id } });
  }
  fetchRecentBundles(): AxiosPromise<StyleBundle[]> {
    return apiClient.get(`${BASE_URL}/recent-bundles`);
  }
  fetchOperatorEfficiency(): AxiosPromise<DashboardOperatorEfficiency[]> {
    return apiClient.get(`${BASE_URL}/operators-efficiency`);
  }
  fetchMachinePleatsStats(): AxiosPromise<MachinePleatsDashboard[]> {
    return apiClient.get(`${BASE_URL}/machine-pleats`);
  }
}

export default new DashboardService();
