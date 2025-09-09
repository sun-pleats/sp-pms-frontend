import { BuyerService } from '@/app/services/BuyerService';
import { DefaultFormData } from '@/app/types/form';
import { useState } from 'react';

export const useBuyerPage = () => {
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);

  const saveBuyer = async (e: DefaultFormData) => {
    try {
      setIsSaveLoading(true);
      const response = await BuyerService.createBuyer({
        name: e.name
      });
      return response;
    } catch (error) {
      setIsSaveLoading(false);
      throw error;
    }
  };

  const updateBuyer = async (id: string, e: DefaultFormData) => {
    try {
      setIsSaveLoading(true);
      const response = await BuyerService.updateBuyer(id, {
        name: e.name
      });
      return response;
    } catch (error) {
      setIsSaveLoading(false);
      throw error;
    }
  };

  return {
    saveBuyer,
    updateBuyer,
    isSaveLoading
  };
};
