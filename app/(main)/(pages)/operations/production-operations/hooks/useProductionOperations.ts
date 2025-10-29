import { DefaultFormData } from '@/app/types/form';
import { formatDbDate, generateSimpleId } from '@/app/utils';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Operator, OperatorProcess } from '@/app/types/operator';
import { OperatorProcessService } from '@/app/services/OperatorProcessService';
import { ProductionTrack } from '@/app/types/production-track';
import { ProductionTrackService } from '@/app/services/ProductionTrackService';
import { SelectItem } from 'primereact/selectitem';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useUtilityData from '@/app/hooks/useUtilityData';

interface TrackFilter {
  date?: any;
  section_id?: any;
  process_ids?: string[];
}

export interface FormData extends DefaultFormData {
  tracks: ProductionTrack[];
}

export const useProductionOperations = () => {
  const [loadings, setLoadings] = useState<{
    fetchingProcesses: boolean;
    fetchingOperator: boolean;
    fetchingSections: boolean;
    storingTracks: boolean;
    duplicatingTracks: boolean;
    fetchingTracks: boolean;
  }>({
    fetchingProcesses: false,
    fetchingOperator: false,
    fetchingSections: false,
    storingTracks: false,
    duplicatingTracks: false,
    fetchingTracks: false
  });

  const [trackFilter, setTrackFilter] = useState<TrackFilter>({
    date: new Date()
  });
  const [isInitDataLoaded, setIsInitDataLoaded] = useState<boolean>(false);
  const [selectedOperatorProcess, setSelectedOperatorProcess] = useState<OperatorProcess | undefined>();
  const [productionTracks, setProductionTracks] = useState<ProductionTrack[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [processOptions, setProcessOptions] = useState<SelectItem[]>();
  const [classificationOptions, setClassificationOptions] = useState<SelectItem[]>();
  const [sectionOptions, setSectionOptions] = useState<SelectItem[]>();
  const [tracksToDelete, setTracksToDelete] = useState<string[]>([]);
  const { showApiError, showSuccess } = useContext(LayoutContext);
  const { fetchProcessOptions, fetchOperators, fetchSectionSelectOption, fetchProductionTrackClassifications } = useUtilityData();
  const { control, handleSubmit, reset, getValues, formState } = useForm<FormData>({
    defaultValues: {
      tracks: []
    }
  });
  const isAutoSavingRefs = useRef(false);

  const operatorsOption = React.useMemo<SelectItem[]>(() => {
    return operators
      .filter((r) => r.section_id === trackFilter.section_id)
      .map((r) => ({ label: r.name, value: r.id }))
      .reduce<SelectItem[]>((acc, curr) => {
        if (!acc.some((item) => item.value === curr.value)) {
          acc.push(curr);
        }
        return acc;
      }, []);
  }, [operators, trackFilter]);

  const { append, remove, update } = useFieldArray({
    control,
    name: 'tracks'
  });

  const items = useWatch({ control, name: 'tracks' }) || [];

  const addNewItem = () => {
    append(emptyItem());
  };

  const emptyItem = (): ProductionTrack => ({
    id: generateSimpleId() + (items?.length + 1).toString(),
    date: trackFilter.date,
    section_id: trackFilter.section_id,
    time: 0,
    target: 0,
    process_id: '',
    operator_id: '',
    style_id: '',
    remarks: '',
    classification: ''
  });

  const setLoading = (loading: any) => {
    setLoadings({
      ...loadings,
      ...loading
    });
  };

  const getProcessOptions = (rowIndex: number): SelectItem[] => {
    const option = items[rowIndex];
    return (
      operators?.find((s) => s.id == option.operator_id)?.operator_processes?.map((p) => ({ value: p.process.id, label: p.process.name })) ?? []
    ).reduce<SelectItem[]>((acc, curr) => {
      if (!acc.some((item) => item.value === curr.value)) {
        acc.push(curr);
      }
      return acc;
    }, []);
  };

  const storeTracks = async (e: FormData, autoSave: boolean = false) => {
    try {
      setLoading({ storingTracks: true });
      const { data } = await ProductionTrackService.storeTracks({
        tracks: e.tracks.map((r) => ({
          id: r.id ?? false,
          date: formatDbDate(r.date),
          section_id: trackFilter.section_id,
          operator_id: r.operator_id ?? '',
          process_id: r.process_id ?? '',
          style_id: r.style_id ?? '',
          target: r.target,
          time: r.time,
          remarks: r.remarks
        })),
        delete_tracks: tracksToDelete
      });

      setTracks(data);

      if (!autoSave) showSuccess('Production process successfully saved.');
      else console.log('Auto saved!');
    } catch (e: any) {
      if (!autoSave) showApiError(e, 'Error saving production process.');
      else console.log('Error autosave:', e);
    } finally {
      setLoading({ storingTracks: false });
    }
  };

  const duplicateTracks = async () => {
    try {
      setLoading({ duplicatingTracks: true });
      const dateNow = moment(trackFilter.date);
      const dateNext = dateNow.clone().add('day', 1);
      await ProductionTrackService.duplicate(trackFilter.section_id, dateNow.toDate(), dateNext.toDate());
      showSuccess('Production processes duplicated successfully.');
    } catch (e: any) {
      showApiError(e, 'Error duplicating production process.');
    } finally {
      setLoading({ duplicatingTracks: false });
    }
  };

  const fetchTracks = useCallback(async () => {
    if (isInitDataLoaded && trackFilter.section_id) {
      try {
        setLoading({ fetchingTracks: true });

        const { data } = await ProductionTrackService.getTracks(trackFilter.section_id, {
          track_date: moment(trackFilter.date).format('YYYY-MM-DD'),
          process_ids: trackFilter.process_ids
        });

        setTracks(data);
      } catch (e: any) {
        showApiError(e, 'Error fetching production process.');
      } finally {
        setLoading({ fetchingTracks: false });
      }
    }
  }, [isInitDataLoaded, trackFilter]);

  const setTracks = (data: ProductionTrack[]) => {
    // Reset first
    reset();

    // Load the fetched data
    data.forEach((d) => {
      append({
        id: d.id,
        date: d.date,
        section_id: d.section_id,
        operator_id: d.operator_id,
        style_id: d.style?.style_number, // @NOTE: The frontend will only gonna pass a actual style number and this is intentional
        process_id: d.process_id,
        target: d.target ?? 0,
        remarks: d.remarks ?? '',
        time: d.time ?? 0,
        classification: d.classification ?? ''
      });
    });

    // Add only new item if not data fetched
    if (!data.length) {
      addNewItem();
    }
  };

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const initData = async () => {
    try {
      setLoading({ fetchingProcesses: true, fetchingOperator: true, fetchingSections: true });

      // Fetch processes
      const processes = await fetchProcessOptions();
      setProcessOptions(processes);

      // Fetch processes
      const ops = await fetchOperators();
      setOperators(ops);

      // Fetch sections
      const sections = await fetchSectionSelectOption();
      setSectionOptions(sections);

      const classifications = await fetchProductionTrackClassifications();
      setClassificationOptions(classifications);

      setIsInitDataLoaded(true);
    } catch (error) {
      console.log('Error init data', error);
    } finally {
      setLoading({ fetchingProcesses: false, fetchingOperator: false, fetchingSections: false });
    }
  };

  const onProcessDeleteClick = (id: any) => {
    setProductionTracks(productionTracks.filter((e) => e.id != id));
  };

  const fetchProcess = async (process_id: any) => {
    return await OperatorProcessService.getProcess(process_id);
  };

  const removeTrack = (track: ProductionTrack, rowIndex: number) => {
    setTracksToDelete([...tracksToDelete, track.id ?? '']);
    remove(rowIndex);
  };

  const updateOperatorTime = (rowIndex: number) => {
    const operatorId = String(getValues(`tracks.${rowIndex}.operator_id`));
    const processId = String(getValues(`tracks.${rowIndex}.process_id`));
    const current = getValues(`tracks.${rowIndex}`);
    const process = operators.find((r) => r.id == operatorId.toString())?.operator_processes?.find((r) => r.process_id?.toString() == processId);

    update(rowIndex, { ...current, time: process?.time || 0 });
  };

  // useEffect(() => {
  //   console.log(formState.touchedFields);
  //   console.log(formState.touchedFields.tracks?.length)
  //   if(formState.touchedFields.tracks?.length != 0) autoSave();
  // }, [formState.touchedFields]);

  const autoSave = async () => {
    const hasEmptyTrack = items.some(
      (t) =>
        !t.operator_id ||
        !t.process_id ||
        !t.style_id ||
        t.target == null ||
        t.time == null ||
        t.operator_id === '' ||
        t.classification === '' ||
        t.process_id === '' ||
        t.style_id === '' ||
        t.target === '' ||
        t.time === ''
    );

    if (hasEmptyTrack || items.length == 0) return;

    if (isAutoSavingRefs.current) return;
    isAutoSavingRefs.current = true;

    try {
      await storeTracks(getValues(), true); // Auto save
    } catch (e: any) {
      console.log('Error Autosaving: ', e);
    } finally {
      isAutoSavingRefs.current = false;
    }
  };

  return {
    onProcessDeleteClick,
    setProductionTracks,
    setSelectedOperatorProcess,
    getProcessOptions,
    handleSubmit,
    reset,
    removeTrack,
    fetchProcess,
    initData,
    addNewItem,
    storeTracks,
    fetchTracks,
    operatorsOption,
    sectionOptions,
    processOptions,
    productionTracks,
    selectedOperatorProcess,
    loadings,
    operators,
    items,
    control,
    trackFilter,
    classificationOptions,
    setTrackFilter,
    updateOperatorTime,
    duplicateTracks
  };
};
