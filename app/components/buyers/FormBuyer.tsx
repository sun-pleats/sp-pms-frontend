'use client';

import { SelectItem } from 'primereact/selectitem';
import FormInputText from '../form/input-text/component';
import { BuyerForm } from '@/app/types/buyers';
import { useEffect } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface FormBuyerProps {
  value?: BuyerForm;
  onSubmit?: any;
  children?: any;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required')
});

const FormBuyer = ({ value, onSubmit, children }: FormBuyerProps) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    register,
    setValue
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
      <FormInputText
        placeholder="Buyer name"
        {...register('name')}
        label="Name"
        errorMessage={errors.name?.message}
        isError={errors.name ? true : false}
      />
      {children}
    </form>
  );
};

export default FormBuyer;
