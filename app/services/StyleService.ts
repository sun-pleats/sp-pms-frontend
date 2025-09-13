import { StyleCreatePayload, StylePaginatedResponse, StylePlannedFabricsResponse, StyleReleaseFabricPayload } from '../types/api/styles';
import { Style } from '../types/styles';
import apiClient from '../api/http-common';
import { AxiosPromise } from 'axios';

const BASE_URL = '/api/styles';

export const StyleService = {
  getStyles(params?: Record<string, any>): AxiosPromise<StylePaginatedResponse> {
    return apiClient.get(`${BASE_URL}`, { params });
  },
  getPlannedFabrics(style_id: string): AxiosPromise<StylePlannedFabricsResponse> {
    return apiClient.get(`${BASE_URL}/planned-fabrics/${style_id}`);
  },
  getStyle(id: string) {
    return apiClient.get(`${BASE_URL}/${id}`);
    // return fetch('/demo/data/styles.json', { headers: { 'Cache-Control': 'no-cache' } })
    //   .then((res) => res.json())
    //   .then((d) => d.data.find((r: Style) => r.id == id));
  },
  createStyle(payload: StyleCreatePayload) {
    return apiClient.post(`${BASE_URL}`, payload);
  }
};
