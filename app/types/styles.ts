import { Buyer } from './buyers';
import { Department } from './department';
import { User } from './users';

export interface Style {
  id: string;
  control_number: string;
  buyer_id: string;
  style_number: string;
  pleats_name: string;
  item_type: string;
  ship_date_from_japan: string; // or Date, if you handle date types
  ship_date_from_cebu: string; // or Date
  noumae: string;
  sample: string;
  pattern: string;
  season: string;
  status: string;
  buyer?: Buyer;
}

export interface StyleItem {
  id?: string | number;
  style_id?: string | number; // depends if it's UUID/int, you can refine
  item_name?: string;
  item_number?: string;
  specs_qty?: number;
  specs_unit?: string;
  youjyaku_qty?: number;
  youjyaku_unit?: string;
  color_detail?: string;
  style?: Style;
}

export interface StylePlannedFabric {
  id: number;
  style_id: number;
  col_number: number;
  color: string;
  created_at: string; // ISO datetime from API
  updated_at: string; // ISO datetime from API
  style?: Style;
}

export interface StylePlannedFabricSize {
  id: number;
  style_planned_fabric_id: number;
  size_number: number;
  quantity: number;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
  style_planned_fabric?: StylePlannedFabric;
}

export interface FormStyleFabric {
  id?: string | number;
  col_number?: string;
  color?: string;
  size_one?: number;
  size_two?: number;
  size_three?: number;
  size_four?: number;
  size_five?: number;
  total?: number;
}

export interface FormReleaseBundle {
  id?: string | number;
  roll_number?: number;
  style_planned_fabric_id?: string;
  style_planned_fabric_size_id?: string;
  quantity?: number;
  remarks?: string;
}

export interface StyleBundle {
  id?: number; // optional if coming from backend
  style_id: number;
  style_planned_fabric_id: number;
  style_planned_fabric_size_id: number;
  roll_number?: number;
  bundle_number: string; // change to number if your DB uses int
  quantity: number;
  remarks?: string | null;
  style?: Style;
  style_planned_fabric?: StylePlannedFabric;
  style_planned_fabric_size?: StylePlannedFabricSize;
  belong_style_bundle_id?: number;
  belong_style_bundle?: StyleBundle;
  created_at?: string;
}

export interface StyleBundleEntryLog {
  style_bundle_id?: string;
  entry_time?: string;
  exit_time?: string;
  department_id?: string;
  entry_by_user_id?: string;
  exit_by_user_id?: string;
  returned?: string;
  remarks?: string;
  style_bundle?: StyleBundle;
  entry_by_user?: User;
  exit_by_user?: User;
  past_log?: boolean; // Temporary not part of the model Will appear only during logging
  department?: Department;
}

export type BundleMovementRecord = {
  id: string; // unique id per hop
  department: string;
  entryTime: string; // ISO string
  exitTime: string; // ISO string
  user: string; // who recorded the movement
};
