'use client';

import { DashboardOperatorEfficiency } from '@/app/types/dashboard';
import { Skeleton } from 'primereact/skeleton';
import { Tag } from 'primereact/tag';

interface DashboardStatisticsProps {
  value?: DashboardOperatorEfficiency[];
  loading?: boolean;
}

const DashboardOperatorPerformer = ({ value, loading }: DashboardStatisticsProps) => {
  return (
    <div className="card">
      <div className="flex justify-content-between align-items-center mb-5">
        <h5 className="flex align-content-center gap-2">
          Top Operator Performers <Tag severity="success" value="Monthly"></Tag>
        </h5>
      </div>
      <ul className="list-none p-0 m-0">
        {loading ? (
          <div className="grid gap-2">
            <Skeleton width="100%" height="30px"></Skeleton>
            <Skeleton width="100%" height="30px"></Skeleton>
            <Skeleton width="100%" height="30px"></Skeleton>
            <Skeleton width="100%" height="30px"></Skeleton>
          </div>
        ) : (
          value?.map((operator, index) => (
            <li
              key={`dashboard-operator-performer-${index}`}
              className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
            >
              <div>
                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{operator.operator_name}</span>
                <div className="mt-1 text-600">{operator.section_name}</div>
              </div>
              <div className="mt-2 md:mt-0 flex align-items-center">
                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                  <div className="bg-orange-500 h-full" style={{ width: '50%' }} />
                </div>
                <span className="text-orange-500 ml-3 font-medium">{operator.avg_efficiency}%</span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
export default DashboardOperatorPerformer;
