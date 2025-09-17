import { LOCALSTORAGE_KEYS } from '@/app/constants/local-storage';
import useLocalStorage from '@/app/hooks/useLocalStorage';
import { KioskService } from '@/app/services/KioskService';
import { SelectItem } from 'primereact/selectitem';
import { useEffect, useState } from 'react';

interface KioskFilter {
  barcode?: string;
  selectedSection?: string | number | null;
  logger_barcode?: string;
  returned?: boolean;
  remarks?: string;
}

export default function useKiosk() {
  const [sectionOptions, setSectionOptions] = useState<SelectItem[]>([]);
  const [storedDepartment, setStoredDepartment] = useLocalStorage<string | number | null>(LOCALSTORAGE_KEYS.kiosk.department, 0);
  const [kioskFilters, setKioskFilters] = useState<KioskFilter>({
    barcode: '',
    logger_barcode: ''
  });

  useEffect(() => {
    if (storedDepartment) setKioskFilters({ ...kioskFilters, selectedSection: storedDepartment });
  }, []);

  useEffect(() => {
    if (kioskFilters.selectedSection) setStoredDepartment(kioskFilters.selectedSection);
  }, [kioskFilters.selectedSection]);

  const logStyleBundle = async (filter: KioskFilter) => {
    return await KioskService.logBundle(
      filter.barcode?.toString() ?? '',
      filter.selectedSection?.toString() ?? '',
      filter.logger_barcode ?? '',
      filter.returned,
      filter.remarks ?? null
    );
  };

  const reset = () => {
    setKioskFilters({
      selectedSection: kioskFilters.selectedSection,
      barcode: '',
      logger_barcode: ''
    });
  };

  return {
    setSectionOptions,
    sectionOptions,
    kioskFilters,
    setKioskFilters,
    logStyleBundle,
    reset
  };
}
