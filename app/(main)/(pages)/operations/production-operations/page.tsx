'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Controller } from 'react-hook-form';
import { DataTable } from 'primereact/datatable';
import { FormData, useProductionOperations } from './hooks/useProductionOperations';
import { ProductionTrack } from '@/app/types/production-track';
import { ROUTES } from '@/app/constants/routes';
import { useEffect } from 'react';
import FormCalendar from '@/app/components/form/calendar/component';
import FormDropdown from '@/app/components/form/dropdown/component';
import FormInputNumber from '@/app/components/form/input-number/component';
import FormInputText from '@/app/components/form/input-text/component';
import FormMultiDropdown from '@/app/components/form/multi-dropdown/component';
import moment from 'moment';
import PageHeader from '@/app/components/page-header/component';
import PageTile from '@/app/components/page-title/component';

const ProductionOperationPage = () => {
  const {
    operatorsOption,
    loadings,
    getProcessOptions,
    handleSubmit,
    initData,
    removeTrack,
    addNewItem,
    control,
    items,
    sectionOptions,
    trackFilter,
    setTrackFilter,
    processOptions,
    storeTracks,
    fetchTracks,
    updateOperatorTime,
    duplicateTracks
  } = useProductionOperations();

  useEffect(() => {
    initData();
  }, []);

  const onNextDateClick = () => {
    setTrackFilter({
      ...trackFilter,
      date: moment(trackFilter.date).add(1, 'day').toDate()
    });
  };

  const onPrevDateClick = () => {
    setTrackFilter({
      ...trackFilter,
      date: moment(trackFilter.date).subtract(1, 'day').toDate()
    });
  };

  const submit = (e: FormData) => {
    storeTracks(e);
  };

  const actionBodyTemplate = (rowData: ProductionTrack, options: { rowIndex: number }) => {
    return (
      <>
        <Button
          size="small"
          outlined
          rounded
          type="button"
          onClick={() => removeTrack(rowData, options.rowIndex)}
          icon="pi pi-trash"
          severity="danger"
        />
      </>
    );
  };

  const handleSectionChange = (option: any) => {
    setTrackFilter({ ...trackFilter, section_id: option.value });
  };

  return (
    <>
      <PageTile title="Production" icon="pi pi-fw pi-cog" url={ROUTES.PRODUCTION_OPERATION.INDEX} />
      <PageHeader titles={['Operations', 'Production', ` Production Process for ${moment(trackFilter.date).format('Y MMMM D')}`]}></PageHeader>
      <form onSubmit={handleSubmit(submit)}>
        <div className="flex flex-align-items-center">
          <div className="flex flex-align-items-center mr-2">
            <div className="flex align-items-center gap-2">
              <FormDropdown
                loading={loadings.fetchingSections}
                label="Section"
                value={trackFilter.section_id}
                onChange={handleSectionChange}
                filter={true}
                placeholder="Select"
                options={sectionOptions}
              />
              <FormMultiDropdown
                loading={loadings.fetchingProcesses}
                label="Process"
                value={trackFilter.process_ids}
                onChange={(option: any) => setTrackFilter({ ...trackFilter, process_ids: option.value })}
                placeholder="Select"
                filter={true}
                options={processOptions}
              />
              <Button
                disabled={!trackFilter.section_id}
                loading={loadings.fetchingOperator}
                severity="help"
                onClick={() => fetchTracks()}
                type="button"
                size="small"
                className="mt-2"
                icon="pi pi-refresh"
                label="Reload"
              />
            </div>
          </div>
          <div className="flex align-items-center gap-2 ml-auto">
            <div className="mt-2">
              <Button
                size="small"
                type="button"
                disabled={!trackFilter.section_id}
                severity="help"
                onClick={onPrevDateClick}
                icon="pi pi-arrow-left"
              />
            </div>
            <FormCalendar
              disabled={!trackFilter.section_id}
              value={trackFilter.date}
              onChange={(e: any) => setTrackFilter({ ...trackFilter, date: e.value })}
              label="Operation Date"
              readOnlyInput
            />
            <div className="mt-2">
              <Button
                size="small"
                type="button"
                disabled={!trackFilter.section_id}
                severity="help"
                onClick={onNextDateClick}
                icon="pi pi-arrow-right"
              />
            </div>
            <Button
              disabled={!trackFilter.section_id}
              loading={loadings.fetchingOperator}
              severity="help"
              onClick={addNewItem}
              type="button"
              size="small"
              className="mt-2"
              title="Add Process"
              icon="pi pi-plus"
            />
            <Button
              disabled={!trackFilter.section_id}
              loading={loadings.fetchingOperator || loadings.storingTracks}
              severity="success"
              size="small"
              type="submit"
              className="mt-2"
              title="Save"
              icon="pi pi-save"
            />
            <Button
              disabled={!trackFilter.section_id}
              loading={loadings.fetchingOperator || loadings.duplicatingTracks}
              severity="success"
              size="small"
              type="button"
              onClick={duplicateTracks}
              className="mt-2"
              icon="pi pi-clone"
              title="Duplicate to next day"
            />
          </div>
        </div>
        <div className="w-full">
          <DataTable
            rows={10}
            editMode="row"
            value={items}
            loading={loadings.fetchingOperator || loadings.fetchingTracks}
            className="custom-table p-datatable-gridlines"
            showGridlines
            dataKey="id"
            emptyMessage="Please select a section to show records."
            scrollable
          >
            <Column
              field="operator_id"
              header="Operator"
              body={(_row: any, options: { rowIndex: number }) => (
                <Controller
                  control={control}
                  name={`tracks.${options.rowIndex}.operator_id` as const}
                  rules={{ required: 'Operator is required' }}
                  render={({ field, fieldState }) => (
                    <FormDropdown
                      {...field}
                      value={field.value}
                      filter
                      onChange={(e: any) => field.onChange(e.value)}
                      placeholder="Select"
                      errorMessage={fieldState.error?.message}
                      isError={fieldState.error ? true : false}
                      options={operatorsOption}
                    />
                  )}
                />
              )}
            />
            <Column
              field="process_id"
              header="Process"
              body={(_row: any, options: { rowIndex: number }) => (
                <Controller
                  control={control}
                  name={`tracks.${options.rowIndex}.process_id` as const}
                  rules={{ required: 'Process is required' }}
                  render={({ field, fieldState }) => (
                    <FormDropdown
                      {...field}
                      value={field.value}
                      filter
                      onChange={(e: any) => {
                        field.onChange(e.value);
                        updateOperatorTime(options.rowIndex);
                      }}
                      placeholder="Select"
                      errorMessage={fieldState.error?.message}
                      isError={fieldState.error ? true : false}
                      options={getProcessOptions(options.rowIndex)}
                    />
                  )}
                />
              )}
            />
            <Column
              field="style_id"
              header="Style No."
              style={{ minWidth: '12rem' }}
              align="left"
              body={(_row: any, options: { rowIndex: number }) => (
                <Controller
                  control={control}
                  name={`tracks.${options.rowIndex}.style_id` as const}
                  rules={{ required: 'Style number is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <FormInputText
                        {...field}
                        inputClassName="w-full"
                        className="mt-1"
                        placeholder="Style No."
                        errorMessage={fieldState.error?.message}
                        isError={fieldState.error ? true : false}
                      />
                      <div className="pt-1">
                        <a
                          href={`/management/styles?search=${items[options.rowIndex].style_id}`}
                          target="_blank"
                          title="Click here to validate the style number."
                          className="text-gray-500 text-sm"
                        >
                          <i className="pi pi-eye"></i> Validate Style
                        </a>
                      </div>
                    </>
                  )}
                />
              )}
            />
            <Column
              field="time"
              header="Time"
              body={(_row: any, options: { rowIndex: number }) => (
                <Controller
                  control={control}
                  name={`tracks.${options.rowIndex}.time` as const}
                  rules={{ required: 'Time is required', min: { value: 1, message: 'Minimum is 1' } }}
                  render={({ field, fieldState }) => (
                    <FormInputNumber
                      value={field.value as number | null}
                      onValueChange={(e) => field.onChange(e.value ?? null)}
                      placeholder="Seconds"
                      inputClassName="w-full"
                      errorMessage={fieldState.error?.message}
                      isError={fieldState.error ? true : false}
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
                  name={`tracks.${options.rowIndex}.target` as const}
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
            <Column
              field="remarks"
              header="Remarks"
              style={{ minWidth: '12rem' }}
              body={(_row: any, options: { rowIndex: number }) => (
                <Controller
                  control={control}
                  name={`tracks.${options.rowIndex}.remarks` as const}
                  render={({ field, fieldState }) => (
                    <FormInputText
                      {...field}
                      inputClassName="w-full"
                      placeholder="Notes"
                      errorMessage={fieldState.error?.message}
                      isError={fieldState.error ? true : false}
                    />
                  )}
                />
              )}
            />
            <Column field="total_output" header="Total Ouput" />
            <Column header bodyStyle={{ width: 'auto', whiteSpace: 'nowrap' }} alignFrozen="right" frozen body={actionBodyTemplate}></Column>
          </DataTable>
        </div>
      </form>
    </>
  );
};

export default ProductionOperationPage;
