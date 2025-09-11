'use client';

import FormInputText from '../form/input-text/component';
import { useEffect } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SectionForm } from '@/app/types/section';
import FormDropdown from '../form/dropdown/component';
import { SelectItem } from 'primereact/selectitem';
import { DefaultFormData } from '@/app/types/form';
import { get } from 'http';
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

interface FormData extends DefaultFormData {
  name: string;
  department_id?: string;
}

const FormSection = ({ onSubmit, children, departments, value, loading }: FormSectionProps) => {
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: value?.name || '',
      department_id: value?.department_id || ''
    }
  });

  useEffect(() => {
    if (value) {
      reset({
        name: value.name || '',
        department_id: value.department_id || ''
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
        name="break_time_start"
        control={control}
        rules={{ required: 'Break time start is required' }}
        render={({ fieldState, field }) => (
          <FormTime {...field} label="Break Time Start" errorMessage={fieldState.error?.message} isError={fieldState.error ? true : false} />
        )}
      />

      <Controller
        name="break_time_end"
        control={control}
        rules={{ required: 'Break time end is required' }}
        render={({ fieldState, field }) => (
          <FormTime {...field} label="Break Time End" errorMessage={fieldState.error?.message} isError={fieldState.error ? true : false} />
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
      {children}
    </form>
  );
};

export default FormSection;
