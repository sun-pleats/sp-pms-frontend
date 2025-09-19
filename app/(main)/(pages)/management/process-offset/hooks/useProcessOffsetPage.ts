import { ROUTES } from '@/app/constants/routes';
import { ProcessOffsetService } from '@/app/services/ProcessOffsetService';
import { DefaultFormData } from '@/app/types/form';
import { ProcessOffsetForm } from '@/app/types/process-offset';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from 'react';

export const useProcessOffsetPage = (id?: any) => {
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [processOffset, setProcessOffset] = useState<ProcessOffsetForm | undefined>();
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const router = useRouter();

  const getProcessOffset = useCallback(async () => {
    try {
      setIsFetching(true);
      setProcessOffset((await ProcessOffsetService.getProcessOffset(id)).data as ProcessOffsetForm);
    } catch (error) {
      showApiError(error, 'Failed to fetch process offset.');
    } finally {
      setIsFetching(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getProcessOffset();
    }
  }, [id, getProcessOffset]);

  const saveProcessOffset = async (e: DefaultFormData) => {
    try {
      setIsSaveLoading(true);
      const response = await ProcessOffsetService.createProcessOffset({
        name: e.name,
        description: e.description
      });

      showSuccess('Process offset successfully created.');
      setTimeout(() => {
        router.push(ROUTES.PROCESS_OFFSETS.INDEX);
      }, 2000);
    } catch (error) {
      showApiError(error, 'Failed to save process offset.');
    } finally {
      setIsSaveLoading(false);
    }
  };

  const updateProcessOffset = async (e: DefaultFormData) => {
    try {
      setIsSaveLoading(true);
      const response = await ProcessOffsetService.updateProcessOffset(id, {
        name: e.name,
        description: e.description
      });

      showSuccess('Process offset successfully updated.');
      setTimeout(() => {
        router.push(ROUTES.PROCESS_OFFSETS.INDEX);
      }, 2000);
    } catch (error) {
      showApiError(error, 'Failed to save process offset.');
    } finally {
      setIsSaveLoading(false);
    }
  };

  return {
    saveProcessOffset,
    updateProcessOffset,
    isFetching,
    isSaveLoading,
    setIsFetching,
    router,
    processOffset
  };
};
