import { DepartmentService } from '@/app/services/DepartmentService';
import { DefaultFormData } from '@/app/types/form';
import { useState } from 'react';

export const useDepartmentPage = () => {
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);

  const saveDepartment = async (e: DefaultFormData) => {
    try {
      setIsSaveLoading(true);
      const response = await DepartmentService.createDepartment({
        name: e.name
      });
      return response;
    } catch (error) {
      setIsSaveLoading(false);
      throw error;
    }
  };

  const updateDepartment = async (id: string, e: DefaultFormData) => {
    try {
      setIsSaveLoading(true);
      const response = await DepartmentService.updateDepartment(id, {
        name: e.name
      });
      return response;
    } catch (error) {
      setIsSaveLoading(false);
      throw error;
    }
  };

  return {
    saveDepartment,
    updateDepartment,
    isSaveLoading
  };
};
