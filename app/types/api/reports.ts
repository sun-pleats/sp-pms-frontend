import { PaginatedResponse } from '.';
import { ProductionDailyOutput, ProductionMonthlyEfficiency } from '../reports';

export interface ReportProductionDailyOutputResponse extends PaginatedResponse {
  data?: ProductionDailyOutput[];
}

export interface ProductionMonthlyEfficiencyResponse extends PaginatedResponse {
  data?: ProductionMonthlyEfficiency[];
}
