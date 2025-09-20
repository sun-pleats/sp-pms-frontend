import { PaginatedResponse } from '.';
import { ProductionDailyOutput, ProductionMonthlyEfficiency, ReportStyleBundleEntryLog } from '../reports';

export interface ReportProductionDailyOutputResponse extends PaginatedResponse {
  data?: ProductionDailyOutput[];
}

export interface ProductionMonthlyEfficiencyResponse extends PaginatedResponse {
  data?: ProductionMonthlyEfficiency[];
}

export interface ReportStyleBundleEntryLogResponse extends PaginatedResponse {
  data?: ReportStyleBundleEntryLog[];
}
