import { User } from './users';

export interface Process {
  id: string;
  name: string;
  code: string;
  exclude_report?: boolean | null;
  created_by?: User;
  updated_by?: User;
  created_at: string;
  updated_at: string;
}

export interface ProcessForm {
  id: string;
  name: string;
  code: string;
  exclude_report?: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
