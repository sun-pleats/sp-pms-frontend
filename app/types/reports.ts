export interface ProductionDailyOutput {
  id: string;
  operator_id: number;
  operator_name: string;
  process_id: string;
  process_name: string;
  production_track_id: number;
  target: number;
  log_date: string;
  '12AM': number;
  '1AM': number;
  '2AM': number;
  '3AM': number;
  '4AM': number;
  '5AM': number;
  '6AM': number;
  '7AM': number;
  '8AM': number;
  '9AM': number;
  '10AM': number;
  '11AM': number;
  '12PM': number;
  '1PM': number;
  '2PM': number;
  '3PM': number;
  '4PM': number;
  '5PM': number;
  '6PM': number;
  '7PM': number;
  '8PM': number;
  '9PM': number;
  '10PM': number;
  '11PM': number;
  total_output: number;
  efficiency_count: number;
  hour_ratio: number;
  efficiency_summary_count: number;
  efficiency_target: number;
  efficiency: number;
}

export interface ProductionMonthlyEfficiency {
  operator_id: number;
  operator_name: string;
  process_id: string;
  process_name: string;
  section_id: number;
  section_name: string;
  month: number;
  year: number;
  avg_efficiency: number;
}

export interface ReportStyleBundleEntryLog {
  id?: string;
  style_bundle_id?: string;
  style_number?: string;
  bundle_number?: string;
  quantity?: string;
  roll_number?: string;
  remarks?: string;
  entry_time?: string;
  exit_time?: string;
  hours_stayed?: number;
  department_name?: string;
  log_remarks?: string;
  size_number?: string;
  color?: string;
  entry_by_name?: string;
  exit_by_name?: string;
  released_at?: string;
}

export interface ReportShipmentStatus {
  style_id: number; // ss.id
  shipment_date: string; // DATE(ss.ship_date_from_cebu), use string if MySQL returns 'YYYY-MM-DD'
  style_no: string; // ss.style_number
  order_quantity: number; // SUM(sb.quantity)
  saidan: number; // SUM(CASE WHEN d.name = 'SAIDAN' ...)
  at_machine: number; // SUM(CASE WHEN d.name = 'AT MACHINE' ...)
  maekoutei_sewing: number; // SUM(CASE WHEN d.name = 'MAEKOUTEI SEWING' ...)
  maekoutei_chuukan_qc: number; // SUM(CASE WHEN d.name = 'MAEKOUTEI CHUUKAN QC' ...)
  flat_iron: number; // SUM(CASE WHEN d.name = 'FLAT IRON' ...)
  shitsuke: number; // SUM(CASE WHEN d.name = 'SHITSUKE' ...)
  machine_pleats: number; // SUM(CASE WHEN d.name = 'MACHINE PLEATS' ...)
  handpleats: number; // SUM(CASE WHEN d.name = 'HANDPLEATS' ...)
  kumitate_sewing: number; // SUM(CASE WHEN d.name = 'KUMITATE SEWING' ...)
  kumitate_chuukan_qc: number; // SUM(CASE WHEN d.name = 'KUMITATE CHUUKAN QC' ...)
  final_qc: number; // SUM(CASE WHEN d.name = 'FINAL QC' ...)
}
