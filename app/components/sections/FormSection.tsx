'use client';

import { Controller, useForm } from 'react-hook-form';
import { SectionForm } from '@/app/types/section';
import { SelectItem } from 'primereact/selectitem';
import { useEffect } from 'react';
import FormDropdown from '../form/dropdown/component';
import FormInputText from '../form/input-text/component';
import FormSectionBreakTime from './FormSectionBreakTime';
import FormTime from '../form/time/component';

interface FormSectionProps {
  value?: SectionForm;
  onSubmit?: any;
  children?: any;
  departments?: SelectItem[];
  loading?: {
    deparmentField: boolean;
  };
}

const FormSection = ({ onSubmit, children, departments, value, loading }: FormSectionProps) => {
  const { control, handleSubmit, reset } = useForm<SectionForm>({
    defaultValues: {
      name: value?.name || '',
      department_id: value?.department_id || '',
      shift_end: value?.shift_end || '',
      shift_start: value?.shift_start || '',
      breaktimes: []
    }
  });

  useEffect(() => {
    if (value) {
      const timeStringToDate = (timeStr?: string) => {
        if (!timeStr) return undefined;
        const [hour, minute, second] = timeStr.split(':');
        const now = new Date();
        now.setHours(Number(hour) || 0);
        now.setMinutes(Number(minute) || 0);
        now.setSeconds(Number(second) || 0);
        now.setMilliseconds(0);
        return now;
      };

      reset({
        name: value.name || '',
        department_id: value.department_id || '',
        shift_end: timeStringToDate(value.shift_end?.toString()),
        shift_start: timeStringToDate(value.shift_start?.toString()),
        breaktimes: value.breaktimes?.map((r) => ({
          ...r,
          time_end: timeStringToDate(r.time_end?.toString()),
          time_start: timeStringToDate(r.time_start?.toString())
        }))
      });
    }
  }, [value, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ fieldState, field }) => (
          <FormInputText
            {...field}
            label="Name"
            placeholder="Input"
            errorMessage={fieldState.error?.message}
            isError={fieldState.error ? true : false}
          />
        )}
      />

      <Controller
        name="department_id"
        control={control}
        rules={{ required: 'Department is required' }}
        render={({ fieldState, field }) => (
          <FormDropdown
            {...field}
            label="Department"
            placeholder="Select"
            loading={loading?.deparmentField}
            options={departments}
            errorMessage={fieldState.error?.message}
            isError={fieldState.error ? true : false}
          />
        )}
      />
      <Controller
        name="shift_start"
        control={control}
        rules={{ required: 'Shift start is required' }}
        render={({ fieldState, field }) => (
          <FormTime {...field} label="Shift Start" errorMessage={fieldState.error?.message} isError={fieldState.error ? true : false} />
        )}
      />
      <Controller
        name="shift_end"
        control={control}
        rules={{ required: 'Shift end is required' }}
        render={({ fieldState, field }) => (
          <FormTime {...field} label="Shift End" errorMessage={fieldState.error?.message} isError={fieldState.error ? true : false} />
        )}
      />
      <FormSectionBreakTime control={control} />
      {children}
    </form>
  );
};

export default FormSection;
