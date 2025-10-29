import { PaginatedResponse } from '.';
import { ProductionDailyOutput, ProductionMonthlyEfficiency, ReportShipmentStatus, ReportStyleBundleEntryLog } from '../reports';
import { SystemAudit } from '../system-audit';

export interface ReportProductionDailyOutputResponse extends PaginatedResponse {
  data?: ProductionDailyOutput[];
}

export interface ProductionMonthlyEfficiencyResponse extends PaginatedResponse {
  data?: ProductionMonthlyEfficiency[];
}

export interface ReportStyleBundleEntryLogResponse extends PaginatedResponse {
  data?: ReportStyleBundleEntryLog[];
}

export interface ReportSystemAuditResponse extends PaginatedResponse {
  data?: SystemAudit[];
}

export interface ReportShipmentStatusResponse extends PaginatedResponse {
  data?: ReportShipmentStatus[];
}
