import { PaginatedResponse } from '.';
import { ProductionDailyOutput } from '../reports';

export interface ReportProductionDailyOutputResponse extends PaginatedResponse {
  data?: ProductionDailyOutput[];
}
