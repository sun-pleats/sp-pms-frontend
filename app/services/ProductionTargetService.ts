import apiClient from '../api/http-common';
import { AxiosPromise } from 'axios';
import { LogProductionTargetPayload } from '../types/api/production-target';
import { ProductionTargetLog } from '../types/production-target';

const BASE_URL = '/api/production';

export const ProductionTargetService = {
  counterLog(payload: LogProductionTargetPayload): AxiosPromise<ProductionTargetLog> {
    return apiClient.post(`${BASE_URL}/target`, payload);
  }
};
