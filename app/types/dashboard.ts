export interface DashboardStats {
  in_production?: number;
  bundle_released?: number;
  month_efficiency?: number;
  styles_completed?: number;
}

export interface DashboardYearlyEfficiency {
  mont: number;
  month_name: string;
  avg_efficiency: number;
}

export interface DashboardOperatorEfficiency {
  operator_name: string;
  avg_efficiency: number;
  section_name: string;
}
