'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { DataTable } from 'primereact/datatable';
import { FormReleaseBundle, StylePlannedFabricSize } from '@/app/types/styles';
import FormInputNumber from '../form/input-number/component';
import FormInputText from '../form/input-text/component';
import React, { useEffect, useState } from 'react';
import { SelectItem } from 'primereact/selectitem';
import FormDropdown from '../form/dropdown/component';

interface FormStyleProps {
  control?: any;
  colorOptions?: SelectItem[];
  disabled?: boolean;
  sizesOptions?: StylePlannedFabricSize[];
  loading?: boolean;
}

const ReleaseBundleTable = ({ loading, control, disabled, colorOptions = [], sizesOptions = [] }: FormStyleProps) => {
  const items = useWatch({ control, name: 'bundles' }) || [];

  const colors = React.useMemo(() => colorOptions, [colorOptions]);

  const getSizeOptions = (rowIndex: number): SelectItem[] => {
    const option = items[rowIndex];
    return (
      sizesOptions
        ?.filter((s) => s.style_planned_fabric_id == option.style_planned_fabric_id)
        ?.map((r) => ({
          label: `${r.size_number.toString()} - ${r.quantity.toString()}`,
          value: r.id
        })) ?? []
    );
  };

  const emptyItem = (): FormReleaseBundle => ({
    id: items?.length + 1,
    style_planned_fabric_id: '',
    style_planned_fabric_size_id: '',
    quantity: 0,
    remarks: ''
  });

  const { append, remove } = useFieldArray({
    control,
    name: 'bundles'
  });

  const actionBodyTemplate = (rowData: FormReleaseBundle, options: { rowIndex: number }) => {
    return (
      <div className="flex gap-2">
        <Button size="small" type="button" onClick={() => remove(options.rowIndex)} icon="pi pi-trash" severity="danger" />
      </div>
    );
  };

  const tableHeader = () => {
    return (
      <div className="grid align-items-center p-0">
        <p className="m-0">Bundle List</p>
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
      className="p-datatable-gridlines"
      showGridlines
      dataKey="id"
      loading={loading}
      filterDisplay="menu"
      emptyMessage="No record provided."
    >
      <Column field="id" header="#" />
      <Column
        field="roll_number"
        header="Roll No."
        body={(_row: any, options: { rowIndex: number }) => (
          <Controller
            control={control}
            name={`bundles.${options.rowIndex}.roll_number` as const}
            rules={{ required: 'Roll number is required' }}
            render={({ field, fieldState }) => (
              <FormInputNumber
                value={field.value as number | null}
                onValueChange={(e) => field.onChange(e.value ?? null)}
                placeholder="Number"
                errorMessage={fieldState.error?.message}
                isError={fieldState.error ? true : false}
              />
            )}
          />
        )}
      />
      <Column
        field="style_planned_fabric_id"
        header="Color"
        body={(_row: any, options: { rowIndex: number }) => (
          <Controller
            control={control}
            name={`bundles.${options.rowIndex}.style_planned_fabric_id` as const}
            rules={{ required: 'Color is required' }}
            render={({ field, fieldState }) => (
              <FormDropdown
                {...field}
                value={field.value}
                onChange={(e: any) => field.onChange(e.value)}
                placeholder="Select"
                filter
                errorMessage={fieldState.error?.message}
                isError={fieldState.error ? true : false}
                options={colors}
              />
            )}
          />
        )}
      />
      <Column
        field="style_planned_fabric_size_id"
        header="Size"
        body={(_row: any, options: { rowIndex: number }) => (
          <Controller
            control={control}
            name={`bundles.${options.rowIndex}.style_planned_fabric_size_id` as const}
            rules={{ required: 'Size is required' }}
            render={({ field, fieldState }) => (
              <FormDropdown
                {...field}
                value={field.value}
                filter
                onChange={(e: any) => field.onChange(e.value)}
                placeholder="Select"
                errorMessage={fieldState.error?.message}
                isError={fieldState.error ? true : false}
                options={getSizeOptions(options.rowIndex)}
              />
            )}
          />
        )}
      />
      <Column
        field="quantity"
        header="Quantity"
        body={(_row: any, options: { rowIndex: number }) => (
          <Controller
            control={control}
            name={`bundles.${options.rowIndex}.quantity` as const}
            rules={{ required: 'Quantity is required', min: { value: 1, message: 'Minimum is 1' } }}
            render={({ field, fieldState }) => (
              <FormInputNumber
                value={field.value as number | null}
                onValueChange={(e) => field.onChange(e.value ?? null)}
                placeholder="Qty"
                errorMessage={fieldState.error?.message}
                isError={fieldState.error ? true : false}
              />
            )}
          />
        )}
      />
      <Column
        field="remarks"
        header="Remarks"
        body={(_row: any, options: { rowIndex: number }) => (
          <Controller
            control={control}
            name={`bundles.${options.rowIndex}.remarks` as const}
            render={({ field, fieldState }) => (
              <FormInputText {...field} placeholder="Text" errorMessage={fieldState.error?.message} isError={fieldState.error ? true : false} />
            )}
          />
        )}
      />
      <Column body={actionBodyTemplate}></Column>
    </DataTable>
  );
};

export default ReleaseBundleTable;
