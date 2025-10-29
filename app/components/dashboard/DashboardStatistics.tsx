'use client';

import { DashboardStats } from '@/app/types/dashboard';
import { Skeleton } from 'primereact/skeleton';

interface DashboardStatisticsProps {
  value?: DashboardStats;
  loading?: boolean;
}

const DashboardStatistics = ({ value, loading }: DashboardStatisticsProps) => {
  return (
    <>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">In-Production</span>
              {loading ? (
                <Skeleton width="10rem" className="mb-2"></Skeleton>
              ) : (
                <div className="text-900 font-medium text-xl">{value?.in_production ?? 0}</div>
              )}
            </div>
            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-shopping-cart text-blue-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">Overall </span>
          <span className="text-500">styles running in production.</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Created Bundles</span>
              {loading ? (
                <Skeleton width="10rem" className="mb-2"></Skeleton>
              ) : (
                <div className="text-900 font-medium text-xl">{value?.created_bundles ?? 0}</div>
              )}
            </div>
            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-inbox text-cyan-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">Released </span>
          <span className="text-500">bundles over time.</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Monthly Efficiency</span>
              {loading ? (
                <Skeleton width="10rem" className="mb-2"></Skeleton>
              ) : (
                <div className="text-900 font-medium text-xl">{value?.month_efficiency ?? 0}%</div>
              )}
            </div>
            <div className="flex align-items-center justify-content-center bg-red-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-clock text-red-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">Efficiency average </span>
          <span className="text-500">this month</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Completed Styles</span>
              {loading ? (
                <Skeleton width="10rem" className="mb-2"></Skeleton>
              ) : (
                <>
                  <div className="text-900 font-medium text-xl flex gap-3">
                    <span className="flex align-items-center">
                      <i className="pi pi-sun text-yellow-500" style={{ fontSize: '1.5rem', marginRight: '10px' }}></i> SS{' '}
                      {value?.styles_completed?.SS ?? 0}
                    </span>
                    <span className="flex align-items-center">
                      <i className="pi pi-cloud text-blue-500" style={{ fontSize: '1.5rem', marginRight: '10px' }}></i> AW{' '}
                      {value?.styles_completed?.AW ?? 0}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-check text-green-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">Styles </span>
          <span className="text-500">completed by season</span>
        </div>
      </div>
    </>
  );
};
export default DashboardStatistics;
