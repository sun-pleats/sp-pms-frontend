import { User } from '@/app/types/users';

import apiClient from '../api/http-common';
import type { AxiosPromise } from 'axios';
import { UserCreatePayload } from '../types/api/users';

const BASE_URL = '/api/users';

class UserService {
  getUsers(payload?: Record<string, any>): AxiosPromise {
    return apiClient.get(`${BASE_URL}`, { params: { ...payload } });
  }

  getUser(id: string) {
    return apiClient.get(`${BASE_URL}/${id}`);
  }

  createUser(payload: UserCreatePayload) {
    return apiClient.post(`${BASE_URL}`, payload);
  }

  updateUser(id: string, payload: UserCreatePayload) {
    return apiClient.put(`${BASE_URL}/${id}`, payload);
  }

  deleteUser(id: string) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  }
}

export default new UserService();
