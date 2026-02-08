import { PaginatedResponse } from '.';
import { Operator } from '../operator';

export interface OperatorCreatePayload {
  name: string;
  section_id?: string;
  deterministic_output?: boolean;
  process_ids?: string[];
}

export interface OperatorPaginatedResponse extends PaginatedResponse {
  data?: Operator[];
}
