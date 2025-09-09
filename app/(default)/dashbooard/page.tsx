'use client';

import { Button } from 'primereact/button';
import { formatDateTime } from '@/app/utils';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { ListBox } from 'primereact/listbox';
import { Skeleton } from 'primereact/skeleton';
import { useRouter } from 'next/navigation';
import Barcode from '@/app/components/barcode/Barcode';
import FormDropdown from '@/app/components/form/dropdown/component';
import FormInputText from '@/app/components/form/input-text/component';
import Link from 'next/link';
import Modal from '@/app/components/modal/component';
import React, { useContext, useEffect, useRef, useState } from 'react';
import useKiosk from './hooks/useDashboard';
import useUtilityData from '@/app/hooks/useUtilityData';

interface StyleDetail {
  name: string;
  value: string;
}

const LandingPage = () => {
  return (
    <div className='w-full'>
      <div className='grid grid-col-5 w-full' style={{height: 'calc(100vh / 4)'}}>
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column flex-1 gap-3'>
            <div className='w-full p-2 text-center'>Current Supply</div>
            <div className='text-7xl font-bold flex justify-content-center align-items-center' style={{height: 'calc(25vh - 100px)'}}>1200</div>
          </div>
        </div>  
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column gap-3'>
            <div className='w-full p-2 text-center'>Target</div>
            <div className='text-7xl font-bold flex justify-content-center align-items-center' style={{height: 'calc(25vh - 100px)'}}></div>
          </div>
        </div>  
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column gap-3'>
            <div className='w-full p-2 text-center'>Actual</div>
            <div className='text-7xl font-bold flex justify-content-center align-items-center' style={{height: 'calc(25vh - 100px)'}}></div>
          </div>
        </div>  
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column gap-3'>
            <div className='w-full p-2 text-center'>Progress Rate</div>
            <div className='text-7xl font-bold flex justify-content-center align-items-center' style={{height: 'calc(25vh - 100px)'}}></div>
          </div>
        </div> 
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column'>
            <div className='w-full border-1 p-2 text-center'>Defects</div>
            <div className='text-7xl font-bold border-1 w-full text-center flex justify-content-center align-items-center' style={{height: 'calc(25vh - 60px)'}}>0</div>
          </div>
        </div> 
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column'>
            <div className='w-full border-1 p-2 text-center'>Defects Rate</div>
            <div className='text-7xl font-bold border-1 w-full text-center flex justify-content-center align-items-center' style={{height: 'calc(25vh - 60px)'}}>0%</div>
          </div>
        </div>  
      </div>
      <div className='grid grid-col-5 w-full' style={{height: 'calc(100vh / 4)'}}>
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column gap-3'>
          </div>
        </div>  
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column gap-3'>
          </div>
        </div>  
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column gap-3'>
            <div className='w-full p-2 text-center'>Balance</div>
            <div className='text-7xl font-bold flex justify-content-center align-items-center' style={{height: 'calc(25vh - 100px)'}}>0</div>
          </div>
        </div>  
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column gap-3'>
            <div className='w-full p-2 text-center'>Scan Here</div>
          </div>
        </div> 
        <div className='col-12 lg:col-5 xl:col-4 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column'>
          </div>
        </div>  
      </div>
      <div className='grid grid-col-5 w-full' style={{height: 'calc(100vh / 4)'}}>
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column gap-3'>
            <div className='w-full p-2 text-center'>Current Supply</div>
            <div className='text-7xl font-bold flex justify-content-center align-items-center' style={{height: 'calc(25vh - 100px)'}}>1200</div>
          </div>
        </div>  
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column gap-3'>
            <div className='w-full p-2 text-center'>Target</div>
            <div className='text-7xl font-bold flex justify-content-center align-items-center' style={{height: 'calc(25vh - 100px)'}}></div>
          </div>
        </div>  
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column gap-3'>
            <div className='w-full p-2 text-center'>Actual</div>
            <div className='text-7xl font-bold flex justify-content-center align-items-center' style={{height: 'calc(25vh - 100px)'}}></div>
          </div>
        </div>  
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column gap-3'>
            <div className='w-full p-2 text-center'>Progress Rate</div>
            <div className='text-7xl font-bold flex justify-content-center align-items-center' style={{height: 'calc(25vh - 100px)'}}></div>
          </div>
        </div> 
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column'>
            <div className='w-full border-1 py-2 text-center'>Defects</div>
            <div className='text-7xl font-bold border-1 w-full text-center flex justify-content-center align-items-center' style={{height: 'calc(25vh - 60px)'}}>0</div>
          </div>
        </div> 
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column'>
            <div className='w-full border-1 py-2 text-center'>Defects Rate</div>
            <div className='text-7xl font-bold border-1 w-full text-center flex justify-content-center align-items-center' style={{height: 'calc(25vh - 60px)'}}>0%</div>
          </div>
        </div>  
      </div>
      <div className='grid grid-col-5 w-full' style={{height: 'calc(100vh / 4)'}}>
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column gap-3'>
          </div>
        </div>  
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column gap-3'>
          </div>
        </div>  
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column gap-3'>
            <div className='w-full p-2 text-center'>Balance</div>
            <div className='text-7xl font-bold flex justify-content-center align-items-center' style={{height: 'calc(25vh - 100px)'}}>0</div>
          </div>
        </div>  
        <div className='col-12 lg:col-5 xl:col-2 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column gap-3'>
            <div className='w-full p-2 text-center'>Scan Here</div>
          </div>
        </div> 
        <div className='col-12 lg:col-5 xl:col-4 border-1 surface-border surface-card'>
          <div className='justify-content-center align-items-center flex flex-column'>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default LandingPage;
