import { OperatorService } from '@/app/services/OperatorService';
import { DefaultFormData } from '@/app/types/form';
import { useState } from 'react';

export const useOperatorPage = () => {
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);

  const saveOperator = async (e: DefaultFormData) => {
    try {
      console.log('e', e);
      setIsSaveLoading(true);
      const response = await OperatorService.createOperator({
        name: e.name,
        section_id: e.section_id,
        process_ids: e.process_ids
      });
      return response;
    } catch (error) {
      setIsSaveLoading(false);
      throw error;
    }
  };

  const updateOperator = async (id: string, e: DefaultFormData) => {
    try {
      console.log('e', e);
      setIsSaveLoading(true);
      const response = await OperatorService.updateOperator(id, {
        name: e.name,
        section_id: e.section_id,
        process_ids: e.process_ids
      });
      return response;
    } catch (error) {
      setIsSaveLoading(false);
      throw error;
    }
  };

  return {
    saveOperator,
    updateOperator,
    isSaveLoading
  };
};
