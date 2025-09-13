/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);

  const model: AppMenuItem[] = [
    {
      label: 'Home',
      items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/', disabled: true }]
    },
    {
      label: 'Operations',
      items: [
        { label: 'Production', icon: 'pi pi-fw pi-cog', to: '/operations/production-operations' },
        { label: 'Release Bundles', icon: 'pi pi-fw pi-box', to: '/operations/bundles' },
        { label: 'Style Flow', icon: 'pi pi-fw pi-share-alt', to: '/operations/style-flow', disabled: true },
        { label: ' Machine Pleats', icon: 'pi pi-fw pi-chart-line', to: '/dashboard' } 
      ]
    },
    {
      label: 'Management',
      items: [
        { label: 'Styles', icon: 'pi pi-fw pi-clone', to: '/management/styles' },
        { label: 'Departments', icon: 'pi pi-fw pi-building', to: '/management/departments' },
        { label: 'Sections', icon: 'pi pi-fw pi-sitemap', to: '/management/sections' },
        { label: 'Operators', icon: 'pi pi-fw pi-users', to: '/management/operators' },
        { label: 'Processes', icon: 'pi pi-fw pi-cog', to: '/management/processes' },
        { label: 'Process Offset', icon: 'pi pi-fw pi-sliders-h', to: '/management/process-offset' },
        { label: 'Buyers', icon: 'pi pi-fw pi-users', to: '/management/buyers' }
      ]
    },
    {
      label: 'Reports',
      items: [
        { label: 'Daily Production Output', icon: 'pi pi-fw pi-circle-fill', to: '/reports/daily-production-output' },
        { label: 'Monthly Efficiency Report', icon: 'pi pi-fw pi-circle-fill', to: '/reports/monthly-production-efficiency' },
        { label: 'Bundle Releases', icon: 'pi pi-fw pi-circle-fill', to: '/management/users', disabled: true },
        { label: 'System Audit', icon: 'pi pi-fw pi-circle-fill', to: '/management/users', disabled: true }
      ]
    },
    {
      label: 'Administrator',
      items: [{ label: 'Users', icon: 'pi pi-fw pi-id-card', to: '/administration/users' }]
    }
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
        })}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
