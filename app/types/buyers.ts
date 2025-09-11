export interface Buyer {
  id: string;
  name: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BuyerDashboard {
  id: string;
  name: string;
  current_suply: number;
  target: number;
  actual: number;
  progress_rate: string;
  defects: number;
  defects_rate: string;
  balance: number;
  barcode_image?: string;
  image?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BuyerForm {
  id: string;
  name: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
