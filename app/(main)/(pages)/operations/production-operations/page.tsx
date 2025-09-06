'use client';

import '@xyflow/react/dist/style.css';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Controller } from 'react-hook-form';
import { DataTable } from 'primereact/datatable';
import { OperatorProcess } from '@/app/types/operator';
import { useEffect, useState } from 'react';
import { FormData, useProductionOperations } from './hooks/useProductionOperations';
import FormCalendar from '@/app/components/form/calendar/component';
import FormDropdown from '@/app/components/form/dropdown/component';
import FormInputNumber from '@/app/components/form/input-number/component';
import FormInputText from '@/app/components/form/input-text/component';
import moment from 'moment';
import OperatorOutput from './components/operator-output';
import FormMultiDropdown from '@/app/components/form/multi-dropdown/component';
import PageHeader from '@/app/components/page-header/component';
import { ProductionTrack } from '@/app/types/production-track';
import PageTile from '@/app/components/page-title/component';
import { ROUTES } from '@/app/constants/routes';

interface ProductionOperationPageState {
  showOperatorOutput?: boolean;
  selectedSection?: any;
}

const ProductionOperationPage = () => {
  const [state, setState] = useState<ProductionOperationPageState>({});

  const {
    operatorsOption,
    selectedOperatorProcess,
    loadings,
    getProcessOptions,
    handleSubmit,
    initData,
    removeTrack,
    addNewItem,
    control,
    items,
    sewingLineOptions,
    trackFilter,
    setTrackFilter,
    processOptions,
    storeTracks,
    fetchTracks,
    updateOperatorTime
  } = useProductionOperations();

  useEffect(() => {
    initData();
  }, []);

  const onShowOutput = (rowData: any) => {
    // setSelectedOperatorProcess(rowData);
    // setState({ ...state, showOperatorOutput: true });
  };

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
          type="button"
          icon="pi pi-list"
          className="mr-2"
          onClick={() => onShowOutput && onShowOutput(rowData)}
          severity="warning"
        />
        <Button size="small" type="button" onClick={() => removeTrack(rowData, options.rowIndex)} icon="pi pi-trash" severity="danger" />
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
                options={sewingLineOptions}
              />
              <FormMultiDropdown
                loading={loadings.fetchingProcesses}
                label="Process"
                value={trackFilter.process_ids}
                onChange={(option: any) => setTrackFilter({ ...trackFilter, process_ids: option.value })}
                placeholder="Select"
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
              icon="pi pi-plus"
              label="Add Process"
            />
            <Button
              disabled={!trackFilter.section_id}
              loading={loadings.fetchingOperator || loadings.storingTracks}
              severity="success"
              size="small"
              type="submit"
              className="mt-2"
              icon="pi pi-save"
              label="Save"
            />
          </div>
        </div>
        <div className="w-full">
          <DataTable
            rows={10}
            editMode="row"
            value={items}
            loading={loadings.fetchingOperator || loadings.fetchingTracks}
            className="p-datatable-gridlines"
            showGridlines
            dataKey="id"
            emptyMessage="No record provided."
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
            <Column alignFrozen="right" frozen body={actionBodyTemplate}></Column>
          </DataTable>
        </div>
      </form>
      <OperatorOutput
        operator_proceess_id={selectedOperatorProcess?.id}
        visible={state.showOperatorOutput}
        onHide={() => setState({ ...state, showOperatorOutput: false })}
      />
    </>
  );
};

export default ProductionOperationPage;
