import { SectionService } from '@/app/services/SectionService';
import { SectionForm } from '@/app/types/section';
import { format24Hour } from '@/app/utils';
import { useState } from 'react';

export const useSectionPage = () => {
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);

  const saveSection = async (e: SectionForm) => {
    try {
      setIsSaveLoading(true);
      const response = await SectionService.createSection({
        name: e.name,
        department_id: e.department_id,
        shift_end: format24Hour(e.shift_end),
        shift_start: format24Hour(e.shift_start),
        breaktimes: e.breaktimes?.map((r) => ({
          id: r?.id ?? null,
          type: r.type?.toString() ?? '',
          time_end: format24Hour(r.time_end),
          time_start: format24Hour(r.time_start)
        }))
      });
      return response;
    } catch (error) {
      setIsSaveLoading(false);
      throw error;
    }
  };

  const updateSection = async (id: string, e: SectionForm) => {
    try {
      setIsSaveLoading(true);
      const response = await SectionService.updateSection(id, {
        name: e.name,
        department_id: e.department_id,
        shift_end: format24Hour(e.shift_end),
        shift_start: format24Hour(e.shift_start),
        breaktimes: e.breaktimes?.map((r) => ({
          id: r.id ?? null,
          type: r.type?.toString() ?? '',
          time_end: format24Hour(r.time_end),
          time_start: format24Hour(r.time_start)
        }))
      });
      return response;
    } catch (error) {
      setIsSaveLoading(false);
      throw error;
    }
  };

  return {
    saveSection,
    updateSection,
    isSaveLoading
  };
};
