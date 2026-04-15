'use client';

import FormInputText from '../form/input-text/component';
import { ProcessForm } from '@/app/types/process';
import { useEffect } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';

interface FormProcessProps {
  value?: ProcessForm;
  onSubmit?: any;
  onSuggestClick?: (process: ProcessForm) => void;
  children?: any;
  suggestLoading?: boolean;
}

const schema = yup.object().shape({
  code: yup.string().required('Code is required'),
  name: yup.string().required('Name is required'),
  exclude_report: yup.boolean().optional()
});

const FormProcess = ({ value, onSubmit, children, onSuggestClick, suggestLoading }: FormProcessProps) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    register,
    control,
    getValues
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      code: '',
      name: ''
    }
  });

  useEffect(() => {
    if (value) {
      console.log(value);
      reset({
        name: value?.name,
        code: value?.code,
        exclude_report: value?.exclude_report
      });
    }
  }, [value]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInputText
        placeholder="Process Code"
        {...register('code')}
        label="Code"
        errorMessage={errors.code?.message}
        isError={errors.code ? true : false}
      />

      <div className="flex">
        <div className="ml-auto">
          <Button
            loading={suggestLoading}
            type="button"
            onClick={() => onSuggestClick && onSuggestClick(getValues() as ProcessForm)}
            icon="pi pi-search"
            size="small"
            label="Suggest Code"
            severity="help"
          />
        </div>
      </div>

      <FormInputText
        placeholder="Process name"
        {...register('name')}
        label="Name"
        errorMessage={errors.name?.message}
        isError={errors.name ? true : false}
      />
      <div className="flex align-items-center gap-2 my-3">
        <Controller
          name="exclude_report"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Checkbox inputId="exclude_report" onChange={(e) => field.onChange(e.checked)} checked={field.value ?? false} />
              <label htmlFor="exclude_report" className={classNames({ 'p-error': fieldState.error?.message })}>
                Exclude Report
              </label>
            </>
          )}
        />
      </div>
      {children}
    </form>
  );
};

export default FormProcess;
