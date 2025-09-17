import { AxiosPromise } from 'axios';
import apiClient from '../api/http-common';
import { ProductionMonthlyEfficiencyResponse, ReportProductionDailyOutputResponse } from '../types/api/reports';
import { SystemAudit } from '../types/system-audit';

const BASE_URL = '/api/reports';

export const ReportService = {
  getProductionDailyOutput(params?: Record<string, any>): AxiosPromise<ReportProductionDailyOutputResponse> {
    return apiClient.get(`${BASE_URL}/production-daily-outputs`, { params });
  },
  getAllSystemAudit(params?: Record<string, any>, options?: any): AxiosPromise<SystemAudit[]> {
    return apiClient.get(`${BASE_URL}/system-audits`, { params, ...options });
  },
  exportProductionDailyOutput(params?: Record<string, any>): AxiosPromise<Blob> {
    return apiClient.get(`${BASE_URL}/exports/production-daily-outputs`, { params, responseType: 'blob' });
  },
  getProductionMonthlyEfficiency(params?: Record<string, any>): AxiosPromise<ProductionMonthlyEfficiencyResponse> {
    return apiClient.get(`${BASE_URL}/production-monthly-efficiency`, { params });
  },
  exportProductionMonthlyEfficiency(params?: Record<string, any>): AxiosPromise<Blob> {
    return apiClient.get(`${BASE_URL}/exports/production-monthly-efficiency`, { params, responseType: 'blob' });
  }
};
