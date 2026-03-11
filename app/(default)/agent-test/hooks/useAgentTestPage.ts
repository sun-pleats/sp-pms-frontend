import { LOCALSTORAGE_KEYS } from '@/app/constants/local-storage';
import useLocalStorage from '@/app/hooks/useLocalStorage';
import { TestAgentService } from '@/app/services/TestAgentService';
import { SelectItem } from 'primereact/selectitem';
import { useEffect, useState } from 'react';

interface AgentFilter {
  barcode?: string;
  selectedSection?: string | number | null;
}

export default function useAgentTestPage() {
  const [sectionOption, setSectionOption] = useState<SelectItem[]>([]);
  const [storedSection, setStoredSection] = useLocalStorage<string | number | null>(LOCALSTORAGE_KEYS.kiosk.section, 0);
  const [logState, setLogState] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState<string>('');

  const [agentFilters, setAgentFilters] = useState<AgentFilter>({
    barcode: ''
  });

  useEffect(() => {
    if (storedSection) setAgentFilters({ ...agentFilters, selectedSection: storedSection });
  }, []);

  useEffect(() => {
    if (agentFilters.selectedSection) setStoredSection(agentFilters.selectedSection);
  }, [agentFilters.selectedSection]);

  const logBarcode = async (filter: AgentFilter) => {
    return await TestAgentService.log((filter.selectedSection ?? '').toString(), filter.barcode ?? '');
  };

  const reset = () => {
    setAgentFilters({
      selectedSection: agentFilters.selectedSection,
      barcode: ''
    });
  };

  return {
    setSectionOption,
    sectionOption,
    agentFilters,
    logState,
    message,
    setMessage,
    setLogState,
    setAgentFilters,
    logBarcode,
    reset
  };
}
