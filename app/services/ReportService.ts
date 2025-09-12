import { AxiosPromise } from 'axios';
import apiClient from '../api/http-common';
import { ProductionMonthlyEfficiencyResponse, ReportProductionDailyOutputResponse } from '../types/api/reports';

const BASE_URL = '/api/reports';

export const ReportService = {
  getProductionDailyOutput(params?: Record<string, any>): AxiosPromise<ReportProductionDailyOutputResponse> {
    return apiClient.get(`${BASE_URL}/production-daily-outputs`, { params });
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
