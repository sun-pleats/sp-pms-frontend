import { PaginatedResponse } from '.';
import { Process } from '../process';

export interface ProcessCreatePayload {
  code: string;
  name: string;
  exclude_report?: boolean;
}

export interface ProcessPaginatedResponse extends PaginatedResponse {
  data?: Process[];
}
