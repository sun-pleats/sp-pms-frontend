'use client';

import { Button } from 'primereact/button';
import { Controller, useForm } from 'react-hook-form';
import { DefaultFormData } from '@/app/types/form';
import { FileUploadSelectEvent } from 'primereact/fileupload';
import { ImportStyleResponse } from '@/app/types/api/styles';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Style } from '@/app/types/styles';
import { StyleService } from '@/app/services/StyleService';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInputFile from '@/app/components/form/browse/component';
import Modal from '@/app/components/modal/component';
import React, { useContext, useEffect, useState } from 'react';

interface UploadStylesState {
  show?: boolean;
  importState?: ImportStyleResponse;
}

interface UploadStylesProps {
  style?: Style;
  visible?: boolean;
  onHide?: any;
}

interface StyleDetail {
  name: string;
  value: string;
}

const schema = yup.object().shape({
  file: yup
    .mixed()
    .nullable()
    .test('fileType', 'Only csv files are allowed', (value: any) => {
      if (!value) return true; // allow empty
      return value && value.type === 'text/csv';
    })
});

const UploadStyles = ({ style, visible, onHide }: UploadStylesProps) => {
  const [state, setState] = useState<UploadStylesState>({});

  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    register,
    setValue,
    control
  } = useForm({
    resolver: yupResolver(schema)
  });

  const { showApiError, showSuccess } = useContext(LayoutContext);

  useEffect(() => {
    setState({ ...state, show: visible });
  }, [visible]);


  const onHideModal = () => {
    setState({ ...state, show: false, importState: undefined });
    if (onHide) onHide();
  };

  const onSubmit = async (payload: DefaultFormData) => {
    try {
      const { data } = await importStyles(payload);
      setState({ ...state, importState: data });
      showSuccess('Styles imported successfully save.');
    } catch (error: any) {
      showApiError(error, 'Failed to import styles.');
    }
  };

  const importStyles = async (e: DefaultFormData) => {
    try {
      const form = new FormData();
      form.append('csv_file', e.file);
      setLoading(true);
      const response = await StyleService.import(form);
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return (
    <Modal title="Upload Styles" visible={state.show} onHide={onHideModal} confirmSeverity="danger" hideActions={true}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex m-5">
          <div className="flex flex-column align-items-center m-auto">
            <p>Please choose a file and make sure you provide the suggested format.</p>
            <p><small>You have to upload the file provided from JP (DataList).</small></p>
            <div className="mb-4">
              <Controller
                name="file"
                control={control}
                render={({ field }) => (
                  <FormInputFile
                    accept=".csv,text/csv"
                    auto={false}
                    chooseLabel="Select CSV"
                    disabled={loading}
                    customUpload
                    onSelect={(e: FileUploadSelectEvent) => {
                      const file = e.files[0];
                      field.onChange(file);
                    }}
                  />
                )}
              />
              {errors.file && <p className="text-red-500 text-sm">{errors.file.message}</p>}
            </div>
          </div>
        </div>
        {state.importState &&
          <>
            <hr />
            <div>
              <h5 className='mb-0 text-green-500'>{state.importState.batch_ref_no}</h5>
              <small>Batch Reference No.</small>
              <ul style={{ listStyle: 'none', marginLeft: '10px', padding: 0, cursor: 'pointer' }}>
                <li title='Total styles from the csv provided.'><i className='pi pi-check text-green-500'></i> Total {state.importState.total_upload}</li>
                <li title='Styles skipped uploading due to it is already created on the system.'>
                  <i className='pi pi-exclamation-triangle text-yellow-500'></i>  Styles Skipped {state.importState.skipped}
                </li>
                <li title='Total styles uploaded to the system.'><i className='pi pi-upload text-green-500'></i> Uploaded {state.importState.uploaded_styles.length}</li>
              </ul>
              <p className='mt-2'><i className='pi pi-check-circle text-green-500'></i> Batch Import Success</p>
            </div>
            <hr />
          </>
        }
        <div className="flex">
          <div className="ml-auto">
            <Button loading={loading} type='submit' icon="pi pi-upload" severity="info" label="Upload" className="mr-2" />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UploadStyles;
