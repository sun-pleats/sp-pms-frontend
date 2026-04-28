import apiClient from '../api/http-common';
import type { AxiosPromise } from 'axios';
import { PaginatedResponse } from '../types/api';

const BASE_URL = '/api/logging';

class LogService {
  list(payload?: Record<string, any>, options?: any): AxiosPromise<PaginatedResponse> {
    return apiClient.get(`${BASE_URL}`, { params: { ...payload }, ...options });
  }
}

export default new LogService();
