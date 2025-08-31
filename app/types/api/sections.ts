import { PaginatedResponse } from '.';
import { Section } from '../section';

export interface SectionCreatePayload {
  name: string;
  department_id?: string;
  break_time?: string;
  shift_start?: string;
  shift_end?: string;
}

export interface SectionPaginatedResponse extends PaginatedResponse {
  data?: Section[];
}
