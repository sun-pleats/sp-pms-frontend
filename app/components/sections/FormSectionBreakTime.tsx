'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { DataTable } from 'primereact/datatable';
import React from 'react';
import FormTime from '../form/time/component';
import { SectionBreaktime } from '@/app/types/section';
import FormDropdown from '../form/dropdown/component';
import { SelectItem } from 'primereact/selectitem';

interface FormSectionBreakTimeProps {
  control?: any;
  disabled?: boolean;
  loading?: boolean;
  onQuantityChange?: (size_id: string, index: number, quantity: number) => void;
  onRemoveRow?: (index: number) => void;
}

const FormSectionBreakTime = ({ loading, control, disabled, onRemoveRow }: FormSectionBreakTimeProps) => {
  const items = useWatch({ control, name: 'breaktimes' }) || [];
  const types: SelectItem[] = [
    { label: 'Morning', value: 'morning' },
    { label: 'Noon', value: 'noon' },
    { label: 'Afternoon', value: 'afternoon' },
    { label: 'Night', value: 'night' }
  ];

  const emptyItem = (): SectionBreaktime => ({
    time_start: '',
    time_end: '',
    type: ''
  });

  const { append, remove } = useFieldArray({
    control,
    name: 'breaktimes'
  });

  const actionBodyTemplate = (rowData: SectionBreaktime, options: { rowIndex: number }) => {
    return (
      <div className="flex gap-2">
        <Button
          size="small"
          outlined
          rounded
          type="button"
          onClick={() => {
            if (onRemoveRow) onRemoveRow(options.rowIndex);
            remove(options.rowIndex);
          }}
          icon="pi pi-trash"
          severity="danger"
        />
      </div>
    );
  };

  const tableHeader = () => {
    return (
      <div className="grid align-items-center p-0">
        <p className="m-0">Breaktime</p>
        <div className="ml-auto flex align-items-center gap-2">
          <Button disabled={disabled} severity="help" type="button" onClick={onAddOperatorClick} className="mt-2" icon="pi pi-plus" label="Add" />
        </div>
      </div>
    );
  };

  const onAddOperatorClick = () => {
    addNewItem();
  };

  const addNewItem = () => {
    append(emptyItem());
  };

  return (
    <DataTable
      rows={10}
      editMode="row"
      header={tableHeader()}
      value={items}
      className="custom-table p-datatable-gridlines"
      showGridlines
      dataKey="id"
      loading={loading}
      filterDisplay="menu"
      emptyMessage="No record provided."
    >
      <Column field="id" header="#" />
      <Column
        field="time_start"
        header="Start"
        body={(_row: any, options: { rowIndex: number }) => (
          <Controller
            control={control}
            name={`breaktimes.${options.rowIndex}.time_start` as const}
            rules={{ required: 'Start is required' }}
            render={({ field, fieldState }) => (
              <FormTime
                {...field}
                placeholder="Break Time Start"
                errorMessage={fieldState.error?.message}
                isError={fieldState.error ? true : false}
              />
            )}
          />
        )}
      />
      <Column
        field="time_end"
        header="End"
        body={(_row: any, options: { rowIndex: number }) => (
          <Controller
            control={control}
            name={`breaktimes.${options.rowIndex}.time_end` as const}
            rules={{ required: 'End is required' }}
            render={({ field, fieldState }) => (
              <FormTime {...field} placeholder="Break Time End" errorMessage={fieldState.error?.message} isError={fieldState.error ? true : false} />
            )}
          />
        )}
      />
      <Column
        field="type"
        header="Type"
        body={(_row: any, options: { rowIndex: number }) => (
          <Controller
            control={control}
            name={`breaktimes.${options.rowIndex}.type` as const}
            rules={{ required: 'Type is required' }}
            render={({ field, fieldState }) => (
              <FormDropdown
                {...field}
                value={field.value}
                onChange={(e: any) => field.onChange(e.value)}
                placeholder="Select"
                filter
                errorMessage={fieldState.error?.message}
                isError={fieldState.error ? true : false}
                options={types}
              />
            )}
          />
        )}
      />
      <Column body={actionBodyTemplate}></Column>
    </DataTable>
  );
};

export default FormSectionBreakTime;
