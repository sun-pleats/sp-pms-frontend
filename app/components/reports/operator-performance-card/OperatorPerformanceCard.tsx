import React, { useEffect, useMemo } from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { ProductionDailyOutput } from '@/app/types/reports';
import { groupBy } from 'lodash';
import { ProgressSpinner } from 'primereact/progressspinner';

export type OperatorPerformance = {
  outputs?: ProductionDailyOutput[];
  loading?: boolean;
};

const StatRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <li className="flex align-items-center justify-content-between my-2 mx-0">
    <span className="font-medium text-color-secondary">{label}</span>
    <span className="p-tag p-tag-warning">{value}%</span>
  </li>
);

const EfficiencyRow = ({ value }: { value: number }) => {
  const severity = value >= 90 ? 'success' : value >= 70 ? 'info' : value >= 40 ? 'warning' : 'danger';
  return (
    <div className="flex items-center gap-2">
      <ProgressBar value={value} showValue={false} style={{ height: 8, width: '100%' }}></ProgressBar>
      <Tag value={`${value.toFixed(0)}%`} severity={severity as any} rounded></Tag>
    </div>
  );
};

const EfficiencyCard = (operatorName: string, outputs: ProductionDailyOutput[]) => {
  const efficiencies = outputs.map((o) => o.efficiency);
  const avg = efficiencies.reduce((sum, val) => sum + val, 0) / efficiencies.length || 0;
  return (
    <div className="col-12 md:col-6 lg:col-4">
      <Card className="h-full shadow-2 border-round-2xl">
        <div className="mb-3">
          <h3 className="text-lg font-semibold">{operatorName}</h3>
        </div>
        <ul className="list-none p-0 m-0">
          {outputs.map((output, index) => (
            <StatRow key={`${operatorName}-${output.id ?? index}`} label={output.process_name} value={output.efficiency} />
          ))}
        </ul>
        <div>
          <span className="font-medium text-color-secondary text-sm">Average Efficiency</span>
          <EfficiencyRow value={avg} />
        </div>
      </Card>
    </div>
  );
};

// Component
export default function OperatorPerformanceCard({ outputs, loading }: OperatorPerformance) {
  const groupedOutputs = useMemo<any>(() => {
    return groupBy<any[]>(outputs, 'operator_name');
  }, [outputs]);
  return (
    <div className="grid">
      {!outputs?.length && !loading && (
        <div className="col-12 flex justify-content-center align-items-center">
          <p className="text-mute">No records found.</p>
        </div>
      )}
      {Object.entries(groupedOutputs).map(([operatorName, opts]) => (
        <React.Fragment key={operatorName}>{EfficiencyCard(operatorName, opts as ProductionDailyOutput[])}</React.Fragment>
      ))}
      {loading && (
        <div className="col-12 flex justify-content-center align-items-center">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
        </div>
      )}
    </div>
  );
}
