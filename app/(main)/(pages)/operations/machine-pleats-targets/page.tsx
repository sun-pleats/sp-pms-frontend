'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Controller } from 'react-hook-form';
import { DataTable } from 'primereact/datatable';
import { FormData, useMachinePleatsTargets } from './hooks/useMachinePleatsTargets';
import { ProductionTarget } from '@/app/types/production-target';
import { ROUTES } from '@/app/constants/routes';
import { useEffect } from 'react';
import FormCalendar from '@/app/components/form/calendar/component';
import FormDropdown from '@/app/components/form/dropdown/component';
import FormInputNumber from '@/app/components/form/input-number/component';
import moment from 'moment';
import PageHeader from '@/app/components/page-header/component';
import PageTile from '@/app/components/page-title/component';
import { EMPTY_TABLE_MESSAGE } from '@/app/constants';

const ProductionOperationPage = () => {
  const {
    buyersOption,
    handleSubmit,
    initData,
    removeTarget,
    addNewItem,
    control,
    items,
    targetFilter,
    setTargetFilter,
    storeTargets,
    fetchTargets,
    duplicateTargets,
    departmentOptions,
    fetchingTargets,
    isInitDataLoading
  } = useMachinePleatsTargets();

  useEffect(() => {
    initData();
  }, []);

  const onNextDateClick = () => {
    setTargetFilter({
      ...targetFilter,
      date: moment(targetFilter.date).add(1, 'day').toDate()
    });
  };

  const onPrevDateClick = () => {
    setTargetFilter({
      ...targetFilter,
      date: moment(targetFilter.date).subtract(1, 'day').toDate()
    });
  };

  const submit = (e: FormData) => {
    storeTargets(e);
  };

  const actionBodyTemplate = (rowData: ProductionTarget, options: { rowIndex: number }) => {
    return (
      <div className="mb-3">
        <Button size="small" type="button" onClick={() => removeTarget(rowData, options.rowIndex)} icon="pi pi-trash" severity="danger" />
      </div>
    );
  };

  return (
    <>
      <PageTile title="Machine Pleats Targets" icon="pi pi-fw pi-cog" url={ROUTES.PRODUCTION_OPERATION.INDEX} />
      <PageHeader titles={['Operations', 'Production', `Target for ${moment(targetFilter.date).format('Y MMMM D')}`]}></PageHeader>
      <form onSubmit={handleSubmit(submit)}>
        <div className="flex flex-align-items-center">
          <div className="flex align-items-center gap-2  ">
            <div className="mt-2">
              <Button size="small" type="button" severity="help" onClick={onPrevDateClick} icon="pi pi-arrow-left" />
            </div>
            <FormCalendar
              value={targetFilter.date}
              onChange={(e: any) => setTargetFilter({ ...targetFilter, date: e.value })}
              label="Operation Date"
              readOnlyInput
            />
            <div className="mt-2">
              <Button size="small" type="button" severity="help" onClick={onNextDateClick} icon="pi pi-arrow-right" />
            </div>
            <Button severity="help" onClick={addNewItem} type="button" size="small" className="mt-2" title="Add Process" icon="pi pi-plus" />
            <Button severity="success" size="small" type="submit" className="mt-2" title="Save" icon="pi pi-save" />
            <Button
              severity="success"
              size="small"
              type="button"
              onClick={duplicateTargets}
              className="mt-2"
              icon="pi pi-clone"
              title="Duplicate to next day"
            />
            <Button severity="help" onClick={() => fetchTargets()} type="button" size="small" className="mt-2" icon="pi pi-refresh" label="Reload" />
          </div>
        </div>
        <div className="w-full">
          <DataTable
            rows={10}
            value={items}
            loading={fetchingTargets || isInitDataLoading}
            className="custom-table p-datatable-gridlines"
            showGridlines
            dataKey="id"
            emptyMessage={EMPTY_TABLE_MESSAGE}
            scrollable
          >
            <Column
              field="buyer_id"
              header="Buyer"
              body={(_row: any, options: { rowIndex: number }) => (
                <Controller
                  control={control}
                  name={`targets.${options.rowIndex}.buyer_id` as const}
                  rules={{ required: 'Buyer is required' }}
                  render={({ field, fieldState }) => (
                    <FormDropdown
                      {...field}
                      value={field.value}
                      filter
                      onChange={(e: any) => field.onChange(e.value)}
                      placeholder="Select"
                      errorMessage={fieldState.error?.message}
                      isError={fieldState.error ? true : false}
                      options={buyersOption}
                    />
                  )}
                />
              )}
            />
            <Column
              field="order"
              header="Order"
              body={(_row: any, options: { rowIndex: number }) => (
                <Controller
                  control={control}
                  name={`targets.${options.rowIndex}.order` as const}
                  rules={{ required: 'Order is required', min: { value: 1, message: 'Minimum is 1' } }}
                  render={({ field, fieldState }) => (
                    <FormInputNumber
                      value={field.value as number | null}
                      onValueChange={(e) => field.onChange(e.value ?? null)}
                      placeholder="Display Order"
                      inputClassName="w-full"
                      errorMessage={fieldState.error?.message}
                      isError={fieldState.error ? true : false}
                    />
                  )}
                />
              )}
            />
            <Column
              field="flow_department_id_1"
              header="Origin Department"
              body={(_row: any, options: { rowIndex: number }) => (
                <Controller
                  control={control}
                  name={`targets.${options.rowIndex}.flow_department_id_1` as const}
                  rules={{ required: 'Origin department is required' }}
                  render={({ field, fieldState }) => (
                    <FormDropdown
                      {...field}
                      value={field.value}
                      filter
                      onChange={(e: any) => field.onChange(e.value)}
                      placeholder="Select"
                      errorMessage={fieldState.error?.message}
                      isError={fieldState.error ? true : false}
                      options={departmentOptions}
                    />
                  )}
                />
              )}
            />
            <Column
              field="flow_department_id_2"
              header="Destination Department"
              body={(_row: any, options: { rowIndex: number }) => (
                <Controller
                  control={control}
                  name={`targets.${options.rowIndex}.flow_department_id_2` as const}
                  rules={{ required: 'Destination department is required' }}
                  render={({ field, fieldState }) => (
                    <FormDropdown
                      {...field}
                      value={field.value}
                      filter
                      onChange={(e: any) => field.onChange(e.value)}
                      placeholder="Select"
                      errorMessage={fieldState.error?.message}
                      isError={fieldState.error ? true : false}
                      options={departmentOptions}
                    />
                  )}
                />
              )}
            />
            <Column
              field="target"
              header="Target"
              body={(_row: any, options: { rowIndex: number }) => (
                <Controller
                  control={control}
                  name={`targets.${options.rowIndex}.target` as const}
                  rules={{ required: 'Target is required', min: { value: 1, message: 'Minimum is 1' } }}
                  render={({ field, fieldState }) => (
                    <FormInputNumber
                      value={field.value as number | null}
                      onValueChange={(e) => field.onChange(e.value ?? null)}
                      placeholder="Qty"
                      inputClassName="w-full"
                      errorMessage={fieldState.error?.message}
                      isError={fieldState.error ? true : false}
                    />
                  )}
                />
              )}
            />
            <Column alignFrozen="right" frozen body={actionBodyTemplate}></Column>
          </DataTable>
        </div>
      </form>
    </>
  );
};

export default ProductionOperationPage;
