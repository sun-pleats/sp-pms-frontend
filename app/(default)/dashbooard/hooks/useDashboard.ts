import { LOCALSTORAGE_KEYS } from "@/app/constants/local-storage";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { KioskService } from "@/app/services/KioskService";
import { SelectItem } from "primereact/selectitem";
import { useEffect, useState } from "react";

interface KioskFilter {
  barcode?: string;
  selectedDepartment?: string | number | null,
  logger_barcode?: string;
  returned?: boolean,
  remarks?: string,
}

export default function useKiosk() {
  const [departmentOption, setDepartmentOption] = useState<SelectItem[]>([]);
  const [storedDepartment, setStoredDepartment] = useLocalStorage<string | number | null>(LOCALSTORAGE_KEYS.kiosk.department, 0);
  const [kioskFilters, setKioskFilters] = useState<KioskFilter>({
    barcode: '',
    logger_barcode: '',
  });

  useEffect(() => {
    if (storedDepartment) setKioskFilters({ ...kioskFilters, selectedDepartment: storedDepartment });
  }, [])

  useEffect(() => {
    if (kioskFilters.selectedDepartment) setStoredDepartment(kioskFilters.selectedDepartment);
  }, [kioskFilters.selectedDepartment])


  const logStyleBundle = async (filter: KioskFilter) => {
    return await KioskService.logBundle(
      filter.barcode?.toString() ?? '',
      filter.selectedDepartment?.toString() ?? '',
      filter.logger_barcode ?? '',
      filter.returned,
      filter.remarks ?? null
    );
  }

  const reset = () => {
    setKioskFilters({
      selectedDepartment: kioskFilters.selectedDepartment,
      barcode: '',
      logger_barcode: '',
    })
  }

  return {
    setDepartmentOption,
    departmentOption,
    kioskFilters,
    setKioskFilters,
    logStyleBundle,
    reset,
  };
}
