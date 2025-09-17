import { Buyer } from '@/app/types/buyers';
import apiClient from '../api/http-common';
import { AxiosPromise } from 'axios';
import { BuyerCreatePayload, BuyerPaginatedResponse } from '../types/api/buyers';
import { get } from 'http';

const BASE_URL = '/api/buyers';

export const BuyerService = {
  getBuyer(id: string): AxiosPromise<Buyer> {
    return apiClient.get(`${BASE_URL}/${id}`);
  },
  getBuyers(params?: Record<string, any>, options?: any): AxiosPromise<BuyerPaginatedResponse> {
    return apiClient.get(`${BASE_URL}`, { params, ...options });
  },
  createBuyer(payload: BuyerCreatePayload) {
    return apiClient.post(`${BASE_URL}`, payload);
  },
  updateBuyer(id: string, payload: BuyerCreatePayload) {
    return apiClient.put(`${BASE_URL}/${id}`, payload);
  },
  deleteBuyer(id: string) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  }
};
