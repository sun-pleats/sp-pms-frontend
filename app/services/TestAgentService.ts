import { AxiosPromise } from 'axios';
import { StyleBundleEntryLog } from '../types/styles';
import apiClient from '../api/http-common';

const BASE_URL = '/api/production';

export const TestAgentService = {
  log(section_id: string, barcode: string): AxiosPromise<StyleBundleEntryLog> {
    return apiClient.post(`${BASE_URL}/log/test/${section_id}`, { barcode });
  }
};
