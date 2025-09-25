'use client';

import './DashboardTable.css';
import { Image } from 'primereact/image';
import { MachinePleatsDashboard } from '@/app/types/dashboard';
import { useEffect } from 'react';
import ScanHereIcon from '../icons/ScanHereIcon';

interface DashboardTableProps {
  buyers: MachinePleatsDashboard[];
  onScanActualClick: () => void;
  onScanDefectClick: () => void;
}

const DashboardTable = ({ buyers = [], onScanActualClick, onScanDefectClick }: DashboardTableProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F8') {
        event.preventDefault();
        onScanActualClick();
      } else if (event.key === 'F9') {
        event.preventDefault();
        onScanDefectClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
              <div className="col-12 lg:col-4 xl:col-2 border-1 surface-border surface-card cursor-pointer" onClick={onScanActualClick}>
                {idx == 0 ? (
                  <div className="dashboard-card">
                    <div className="dashboard-card-title text-green-500">Scan Actual [F8]</div>
                    <div className="dashboard-card-content font-bold">
                      <ScanHereIcon />
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="col-12 lg:col-4 xl:col-2 border-1 surface-border surface-card cursor-pointer" onClick={onScanDefectClick}>
                {idx == 0 ? (
                  <div className="dashboard-card">
                    <div className="dashboard-card-title text-red-500">Scan Defects [F9]</div>
                    <div className="dashboard-card-content font-bold">
                      <ScanHereIcon />
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="col-12 lg:col-8 xl:col-2 border-1 surface-border surface-card">
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
