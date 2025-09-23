'use client';

import { SelectItem } from 'primereact/selectitem';
import FormInputText from '../form/input-text/component';
import { BuyerForm } from '@/app/types/buyers';
import { useEffect } from 'react';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';

interface FormBuyerProps {
  value?: BuyerForm;
  onSubmit?: any;
  children?: any;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  buyer_logo: yup
    .mixed()
    .nullable()
    .test('fileType', 'Only image files are allowed', (value: any) => {
      if (!value) return true; // allow empty
      return value && value.type?.startsWith('image/');
    })
});

const FormBuyer = ({ value, onSubmit, children }: FormBuyerProps) => {
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

  useEffect(() => {
    if (value) {
      reset({
        name: value?.name
      });
    }
  }, [value]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInputText placeholder="Buyer name" {...register('name')} label="Name" errorMessage={errors.name?.message} isError={!!errors.name} />

      {/* PrimeReact FileUpload for Buyer Logo */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Buyer Logo</label>
        <Controller
          name="buyer_logo"
          control={control}
          render={({ field }) => (
            <FileUpload
              mode="basic"
              accept="image/*"
              auto={false}
              chooseLabel="Select Logo"
              customUpload
              onSelect={(e: FileUploadSelectEvent) => {
                const file = e.files[0];
                field.onChange(file);
              }}
            />
          )}
        />
        {errors.buyer_logo && <p className="text-red-500 text-sm">{errors.buyer_logo.message}</p>}
      </div>

      {children}
    </form>
  );
};

export default FormBuyer;
