import { Department } from './department';

export interface Section {
  id?: string;
  name: string;
  break_time?: string;
  shift_start?: string;
  shift_end?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  department_id?: string;
  department?: Department;
}

export interface SectionForm {
  id: string;
  name: string;
  department_id?: string;
  break_time?: string;
  shift_start?: string;
  shift_end?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
