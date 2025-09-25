import { StyleService } from '@/app/services/StyleService';
import { ItemFabricCreatePayload, ItemStyleCreatePayload, StyleCreatePayload, StylePaginatedResponse } from '@/app/types/api/styles';
import { DefaultFormData } from '@/app/types/form';
import { Style } from '@/app/types/styles';
import dayjs from 'dayjs';
import { useState } from 'react';

export const useStylePage = () => {

  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const [styles, setStyles] = useState<Style[]>([]);
  const [isFetchStyleLoading, setIsFetchStyleLoading] = useState<boolean>(false);

  const formatStyleTable = ({ data }: StylePaginatedResponse): Style[] => {
    return data ?? [];
  };

  const fetchStyles = async () => {
    try {
      setIsFetchStyleLoading(true);
      const { data } = await StyleService.getStyles();
      setStyles(formatStyleTable(data));
    } catch (error) {
      throw error;
    } finally {
      setIsFetchStyleLoading(false);
    }
  }

  const formatSavePayload = (data: DefaultFormData): StyleCreatePayload => {
    return {
      control_number: data.control_number ?? "",
      buyer_id: data.buyer_id ?? "",
      style_number: data.style_number ?? "",
      pleats_name: data.pleats_name ?? null,
      item_type: data.item_type ?? null,
      season: data.season ?? null,
      noumae: data.noumae ?? null,
      sample: data.sample ?? null,
      pattern: data.pattern ?? null,

      ship_date_from_japan: data.ship_date_from_japan
        ? dayjs(data.ship_date_from_japan).format("YYYY-MM-DD")
        : null,
      ship_date_from_cebu: data.ship_date_from_cebu
        ? dayjs(data.ship_date_from_cebu).format("YYYY-MM-DD")
        : null,
      style_items: ((data?.style_items ?? []) as ItemStyleCreatePayload[]),
      style_fabrics: ((data?.style_fabrics ?? []) as ItemFabricCreatePayload[]),
    };
  }

  const saveStyle = async (e: DefaultFormData) => {
    try {
      setIsSaveLoading(true);
      const response = await StyleService.createStyle(formatSavePayload(e));
      return response;
    } catch (error) {
      setIsSaveLoading(false);
      throw error;
    }
  }

  const updateStyle = async (id: string, e: DefaultFormData) => {
    try {
      setIsSaveLoading(true);
      const response = await StyleService.updateStyle(id, formatSavePayload(e));
      return response;
    } catch (error) {
      setIsSaveLoading(false);
      throw error;
    }
  }

  return {
    isSaveLoading,
    saveStyle,
    styles,
    isFetchStyleLoading,
    fetchStyles,
    updateStyle
  };
};
