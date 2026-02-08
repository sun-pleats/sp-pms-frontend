'use client';

import FormInputText from '../form/input-text/component';
import { OperatorForm } from '@/app/types/operator';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SelectItem } from 'primereact/selectitem';
import FormDropdown from '../form/dropdown/component';
import FormMultiDropdown from '../form/multi-dropdown/component';
import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';

interface FormOperatorProps {
  value?: OperatorForm;
  lines: SelectItem[];
  onSubmit?: any;
  children?: any;
  processesOptions?: SelectItem[];
  loading?: {
    lineField?: boolean;
    processField?: boolean;
  };
}

type FormData = {
  name: string;
  section_id: string;
  deterministic_output?: boolean;
  process_ids?: string[];
};

const FormOperator = ({ value, onSubmit, children, lines, processesOptions, loading }: FormOperatorProps) => {
  const { handleSubmit, control, reset } = useForm<FormData>({
    defaultValues: {
      name: '',
      section_id: '',
      process_ids: []
    }
  });

  useEffect(() => {
    if (value) {
      // @ts-ignore
      reset({
        name: value?.name,
        section_id: value?.section_id,
        deterministic_output: value?.deterministic_output,
        process_ids: value?.operator_processes?.map((p) => p.id) || []
      });
    }
  }, [value]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ field, fieldState }) => (
          <FormInputText {...field} label="Name" errorMessage={fieldState.error?.message} isError={fieldState.error ? true : false} />
        )}
      />

      <Controller
        name="section_id"
        control={control}
        rules={{ required: 'Line is required' }}
        render={({ field, fieldState }) => (
          <FormDropdown
            {...field}
            value={field.value}
            onChange={(e: any) => field.onChange(e.value)}
            label="Line"
            placeholder="Select"
            loading={loading?.lineField}
            errorMessage={fieldState.error?.message}
            isError={fieldState.error ? true : false}
            options={lines}
            filter={true}
          />
        )}
      />

      <Controller
        name="process_ids"
        control={control}
        rules={{ required: 'Process is required' }}
        render={({ field, fieldState }) => (
          <FormMultiDropdown
            {...field}
            value={field.value}
            onChange={(e: any) => field.onChange(e.value)}
            label="Processes"
            placeholder="Select"
            loading={loading?.processField}
            errorMessage={fieldState.error?.message}
            isError={fieldState.error ? true : false}
            options={processesOptions}
            filter={true}
          />
        )}
      />

      <div className="flex align-items-center gap-2 my-3">
        <Controller
          name="deterministic_output"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Checkbox inputId="deterministic_output" onChange={(e) => field.onChange(e.checked)} checked={field.value ?? false} />
              <label htmlFor="deterministic_output" className={classNames({ 'p-error': fieldState.error?.message })}>
                Deterministic Output
              </label>
            </>
          )}
        />
      </div>

      {children}
    </form>
  );
};

export default FormOperator;
