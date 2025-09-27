import { DefaultFormData } from '@/app/types/form';
import { formatDbDate, generateSimpleId } from '@/app/utils';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { OperatorProcess } from '@/app/types/operator';
import { OperatorProcessService } from '@/app/services/OperatorProcessService';
import { ProductionTarget } from '@/app/types/production-target';
import { ProductionTargetService } from '@/app/services/ProductionTargetService';
import { SelectItem } from 'primereact/selectitem';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useUtilityData from '@/app/hooks/useUtilityData';

interface TargetFilter {
  date?: any;
}

export interface FormData extends DefaultFormData {
  targets: ProductionTarget[];
}

export const useMachinePleatsTargets = () => {
  const [loadings, setLoadings] = useState<{
    fetchingBuyers: boolean;
    storingTargets: boolean;
    duplicatingTargets: boolean;
  }>({
    fetchingBuyers: false,
    storingTargets: false,
    duplicatingTargets: false
  });

  const [fetchingTargets, setFetchingTargets] = useState<boolean>(true);
  const [isInitDataLoading, setIsInitDataLoading] = useState<boolean>(false);
  const [isInitDataLoaded, setIsInitDataLoaded] = useState<boolean>(false);
  const [targetFilter, setTargetFilter] = useState<TargetFilter>({
    date: new Date()
  });

  const [selectedOperatorProcess, setSelectedOperatorProcess] = useState<OperatorProcess | undefined>();
  const [productionTargets, setProductionTargets] = useState<ProductionTarget[]>([]);
  const [buyersOption, setBuyersOption] = useState<SelectItem[]>();
  const [departmentOptions, setDepartmentOptions] = useState<SelectItem[]>();
  const [targetsToDelete, setTargetsToDelete] = useState<string[]>([]);
  const { showApiError, showSuccess, showError } = useContext(LayoutContext);
  const { fetchBuyerOptions, fetchDepartmentOptions } = useUtilityData();
  const { control, handleSubmit, reset, getValues } = useForm<FormData>({
    defaultValues: {
      targets: []
    },
    shouldUnregister: false
  });

  const { append, remove } = useFieldArray({
    control,
    name: 'targets',
    keyName: '__key'
  });

  const items = useWatch({ control, name: 'targets' }) || [];

  const addNewItem = () => {
    if (items.length >= 2) {
      showError('The system allows only two buyers to be set.');
      return;
    }
    append(emptyItem());
  };

  const emptyItem = (): ProductionTarget => ({
    id: generateSimpleId() + (items?.length + 1).toString(),
    order: 0,
    date: targetFilter.date,
    target: 0,
    buyer_id: '',
    flow_department_id_1: '',
    flow_department_id_2: ''
  });

  const setLoading = (loading: any) => {
    setLoadings({
      ...loadings,
      ...loading
    });
  };

  const storeTargets = async (e: FormData) => {
    try {
      setLoading({ storingTargets: true });
      await ProductionTargetService.storeTargets({
        targets: e.targets.map((r) => ({
          id: r.id ?? false,
          order: r.order,
          date: formatDbDate(r.date),
          buyer_id: r.buyer_id ?? '',
          flow_department_id_1: r.flow_department_id_1 ?? '',
          flow_department_id_2: r.flow_department_id_2 ?? '',
          target: r.target
        })),
        delete_targets: targetsToDelete
      });
      fetchTargets();
      showSuccess('Production process successfully saved.');
    } catch (e: any) {
      showApiError(e, 'Error saving production process.');
    } finally {
      setLoading({ storingTargets: false });
    }
  };

  const duplicateTargets = async () => {
    try {
      setLoading({ duplicatingTargets: true });
      const dateNow = moment(targetFilter.date);
      const dateNext = dateNow.clone().add('day', 1);
      await ProductionTargetService.duplicate(dateNow.toDate(), dateNext.toDate());
      showSuccess('Production processes duplicated successfully.');
    } catch (e: any) {
      showApiError(e, 'Error duplicating production process.');
    } finally {
      setLoading({ duplicatingTargets: false });
    }
  };

  const fetchTargets = useCallback(async () => {
    if (isInitDataLoaded) {
      try {
        setFetchingTargets(true);

        const { data } = await ProductionTargetService.getTargets({
          target_date: moment(targetFilter.date).format('YYYY-MM-DD')
        });

        reset();

        data.forEach((d) => {
          append({
            id: d.id,
            order: d.order,
            date: d.date,
            buyer_id: d.buyer_id,
            flow_department_id_1: d.flow_department_id_1,
            flow_department_id_2: d.flow_department_id_2,
            target: d.target
          });
        });

        // Add only new item if not data fetched
        if (!data.length) {
          addNewItem();
        }
      } catch (e: any) {
        showApiError(e, 'Error fetching production process.');
      } finally {
        setFetchingTargets(false);
      }
    }
  }, [isInitDataLoaded, targetFilter]);

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  const initData = async () => {
    try {
      setIsInitDataLoading(true);
      // Fetch buyers
      const buyers = await fetchBuyerOptions();
      setBuyersOption(buyers);
      // Fetch departments
      const departments = await fetchDepartmentOptions();
      setDepartmentOptions(departments);

      setIsInitDataLoaded(true);
    } catch (error) {
      console.log('Error init data', error);
    } finally {
      setIsInitDataLoading(false);
    }
  };

  const onProcessDeleteClick = (id: any) => {
    setProductionTargets(productionTargets.filter((e) => e.id != id));
  };

  const fetchProcess = async (process_id: any) => {
    return await OperatorProcessService.getProcess(process_id);
  };

  const removeTarget = (target: ProductionTarget, rowIndex: number) => {
    setTargetsToDelete([...targetsToDelete, target.id ?? '']);
    remove(rowIndex);
  };

  return {
    onProcessDeleteClick,
    setProductionTargets,
    setSelectedOperatorProcess,
    handleSubmit,
    reset,
    removeTarget,
    fetchProcess,
    initData,
    addNewItem,
    storeTargets,
    fetchTargets,
    departmentOptions,
    productionTargets,
    selectedOperatorProcess,
    loadings,
    items,
    control,
    targetFilter,
    fetchingTargets,
    setTargetFilter,
    duplicateTargets,
    buyersOption,
    isInitDataLoading
  };
};
