'use client';

import { Image } from 'primereact/image';
import './DashboardTable.css';
import { MachinePleatsDashboard } from '@/app/types/dashboard';
import ScanHereIcon from '../icons/ScanHereIcon';

interface DashboardTableProps {
  buyers: MachinePleatsDashboard[];
}

const DashboardTable = ({ buyers = [] }: DashboardTableProps) => {
  return (
    <>
      {buyers && buyers.length > 0
        ? buyers.map((buyer, idx) => (
            <div className="dashboard-container grid grid-col-6 w-full" key={buyer.id ?? idx}>
              <div className="col-12 lg:col-4 xl:col-2 surface-border surface-card">
                <div className="dashboard-card">
                  <div className="dashboard-card-title">Current Supply</div>
                  <div className="dashboard-card-content font-bold">{buyer.current_supply}</div>
                </div>
              </div>
              <div className="col-12 lg:col-4 xl:col-2 border-1 surface-border surface-card">
                <div className="dashboard-card">
                  <div className="dashboard-card-title">Target</div>
                  <div className="dashboard-card-content font-bold">{buyer.target}</div>
                </div>
              </div>
              <div className="col-12 lg:col-4 xl:col-2 border-1 surface-border surface-card">
                <div className="dashboard-card">
                  <div className="dashboard-card-title">Actual</div>
                  <div className="dashboard-card-content font-bold text-green-500">{buyer.actual}</div>
                </div>
              </div>
              <div className="col-12 lg:col-4 xl:col-2 border-1 surface-border surface-card">
                <div className="dashboard-card">
                  <div className="dashboard-card-title">Progress Rate</div>
                  <div className="dashboard-card-content font-bold">{buyer.progress_rate}%</div>
                </div>
              </div>
              <div className="col-12 lg:col-4 xl:col-2 border-1 surface-border surface-card">
                <div className="dashboard-card">
                  <div className="dashboard-card-title border-1">Defects</div>
                  <div className="dashboard-card-content font-bold border-1">{buyer.defects}</div>
                </div>
              </div>
              <div className="col-12 lg:col-4 xl:col-2 border-1 surface-border surface-card">
                <div className="dashboard-card">
                  <div className="dashboard-card-title border-1">Defects Rate</div>
                  <div className="dashboard-card-content font-bold border-1">{buyer.defects_rate}%</div>
                </div>
              </div>
              <div className="col-12 lg:col-4 xl:col-2 border-1 surface-border surface-card p-0">
                <div className="col-12  border-blue-800 flex align-items-center justify-content-center">
                  <Image
                    src={buyer.buyer_logo}
                    alt={buyer.buyer_name}
                    imageClassName="w-full h-full object-contain  "
                    preview // opens a lightbox on click
                  />
                </div>
              </div>
              <div className="col-12 lg:col-4 xl:col-2 border-1 surface-border surface-card">
                <div className="dashboard-card">
                  <div className="dashboard-card-title"></div>
                  <div className="dashboard-card-content font-bold"></div>
                </div>
              </div>
              <div className="col-12 lg:col-4 xl:col-2 border-1 surface-border surface-card">
                <div className="dashboard-card">
                  <div className="dashboard-card-title">Balance</div>
                  <div className="dashboard-card-content font-bold text-red-500">{buyer.balance}</div>
                </div>
              </div>
              <div className="col-12 lg:col-4 xl:col-2 border-1 surface-border surface-card">
                <div className="dashboard-card">
                  <div className="dashboard-card-title">Scan Here</div>
                  <div className="dashboard-card-content font-bold">
                    <ScanHereIcon />
                  </div>
                </div>
              </div>
              <div className="col-12 lg:col-8 xl:col-4 border-1 surface-border surface-card">
                <div className="dashboard-card">
                  <div className="dashboard-card-title"></div>
                  <div className="dashboard-card-content font-bold"></div>
                </div>
              </div>
            </div>
          ))
        : null}
    </>
  );
};
export default DashboardTable;
