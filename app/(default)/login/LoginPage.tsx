/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useAuth } from '@/app/contexts/useAuth';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useContext, useState } from 'react';
import { APP_VERSION } from '@/app/constants';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required')
});

const LoginPage = () => {
  const [checked, setChecked] = useState(false);
  const { layoutConfig } = useContext(LayoutContext);

  const { login, loading } = useAuth();
  const {
    handleSubmit,
    formState: { errors },
    register
  } = useForm({
    resolver: yupResolver(schema)
  });

  const containerClassName = classNames(
    'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden gap-5',
    {
      'p-input-filled': layoutConfig.inputStyle === 'filled'
    }
  );

  const onSubmit = async (e: { username: string; password: string }) => {
    await login(e.username, e.password, checked);
  };

  return (
    <div className={containerClassName}>
      <div className="flex align-items-center gap-2">
        <img
          src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`}
          alt="SUN-PLEATS CORP. logo"
          className="w-6rem flex-shrink-0"
        />
        <div>
          <h5 className="m-0">SUN-PLEATS CEBU CORP</h5>
          <small>Production Management</small>
        </div>
      </div>
      <div className="flex flex-column align-items-center justify-content-center">
        <div className="surface-card " style={{ borderRadius: '10px' }}>
          <div className="p-2 bg-red-200 w-fit" style={{ borderRadius: '10px' }}>
            <small>Version v.{APP_VERSION}</small>
          </div>
          <div className="w-full py-8 px-5 sm:px-8">
            <h3>Welcome to SUN-PLEATS</h3>
            <p>Please enter your credentials to use the system.</p>
            <hr className="mb-5" />

            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="username" className="block text-700 mb-2">
                {errors.username ? <span className="text-red-500">{errors.username?.message}</span> : `Username or Email`}
              </label>
              <InputText
                id="username"
                {...register('username')}
                type="text"
                placeholder="Enter Email or Username"
                className={`w-full md:w-30rem mb-5` + (errors.username ? ' p-invalid' : '')}
              />
              <label htmlFor="password" className="block text-black-700 mb-2">
                {errors.password ? <span className="text-red-500">{errors.password?.message}</span> : `Password`}
              </label>
              <InputText
                {...register('password')}
                className={`w-full mb-5` + (errors.username ? ' p-invalid' : '')}
                placeholder="Enter your Password"
                type="password"
                autoComplete="false"
              />

              <div className="flex align-items-center justify-content-between mb-5 gap-5">
                <div className="flex align-items-center">
                  <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                  <label htmlFor="rememberme1">Remember me</label>
                </div>
              </div>

              <p>
                {' '}
                <small>If you forgot your password please contact the Administrator.</small>
              </p>
              <Button outlined loading={loading} label="Sign In" className="w-full   text-xl" type="submit"></Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
