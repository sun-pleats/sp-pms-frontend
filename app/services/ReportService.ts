import { AxiosPromise } from 'axios';
import apiClient from '../api/http-common';
import { ReportProductionDailyOutputResponse } from '../types/api/reports';

const BASE_URL = '/api/reports';

export const ReportService = {
  getProductionDailyOutput(params?: Record<string, any>): AxiosPromise<ReportProductionDailyOutputResponse> {
    return apiClient.get(`${BASE_URL}/production-daily-outputs`, { params });
  }
};
