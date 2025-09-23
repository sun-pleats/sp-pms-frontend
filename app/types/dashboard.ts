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

export interface MachinePleatsDashboard {
  id: string;
  buyer_name: string;
  buyer_logo: string;
  current_supply: number;
  target: number;
  actual: number;
  progress_rate: string;
  defects: number;
  defects_rate: string;
  balance: number;
  barcode_image?: string;
  image?: string;
}
