import { ProcessService } from '@/app/services/ProcessService';
import { DefaultFormData } from '@/app/types/form';
import { useState } from 'react';

export const useProcessPage = () => {
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);

  const saveProcess = async (e: DefaultFormData) => {
    try {
      setIsSaveLoading(true);
      const response = await ProcessService.createProcess({
        code: e.code,
        name: e.name,
        exclude_report: e.exclude_report
      });
      return response;
    } catch (error) {
      setIsSaveLoading(false);
      throw error;
    }
  };

  const updateProcess = async (id: string, e: DefaultFormData) => {
    try {
      setIsSaveLoading(true);
      const response = await ProcessService.updateProcess(id, {
        code: e.code,
        name: e.name,
        exclude_report: e.exclude_report
      });
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsSaveLoading(false);
    }
  };

  const getSuggestProcessCode = async (name: string) => {
    try {
      setIsSuggesting(true);
      const response = await ProcessService.getProcessCodeSuggestion(name);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsSuggesting(false);
    }
  };

  return {
    saveProcess,
    updateProcess,
    getSuggestProcessCode,
    isSaveLoading,
    isSuggesting
  };
};
