'use client';

import { FormReleaseBundle, StyleBundle, StylePlannedFabricSize } from '@/app/types/styles';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ROUTES } from '@/app/constants/routes';
import { SelectItem } from 'primereact/selectitem';
import { StyleBundleService } from '@/app/services/StyleBundleService';
import { StyleService } from '@/app/services/StyleService';
import { useRouter } from 'next/navigation';
import FormAction, { FormActions } from '@/app/components/form-action/component';
import FormBundle from '@/app/components/style/FormBundle';
import PageAction, { PageActions } from '@/app/components/page-action/component';
import PageCard from '@/app/components/page-card/component';
import React, { useCallback, useContext, useEffect, useState } from 'react';

interface EditBundlePageProps {
  params?: { id: any };
}

interface EditBundlePageState {
  loadings?: {
    fetching?: boolean;
    saving?: boolean;
  };
}

const EditBundlePage = ({ params }: EditBundlePageProps) => {
  const router = useRouter();
  const [state, setState] = useState<EditBundlePageState>({});
  const [styleBundle, setStyleBunle] = useState<StyleBundle>();
  const [colorOptions, setColorOptions] = useState<SelectItem[]>([]);
  const [sizesOptions, setSizesOptions] = useState<StylePlannedFabricSize[]>([]);
  const [formData, setFormData] = useState<FormReleaseBundle>({
    style_planned_fabric_id: '',
    style_planned_fabric_size_id: '',
    quantity: 0,
    remarks: ''
  });

  const { showSuccess, showApiError } = useContext(LayoutContext);

  const setLoading = (loadings: any = {}) => {
    setState({ ...state, loadings: { ...state.loadings, ...loadings } });
  };

  const fetchPlannedFabics = async (id: string) => {
    try {
      setLoading({ fetching: true });
      const { data: res } = await StyleService.getPlannedFabrics(id);
      setColorOptions(
        res.colors.map((col) => ({
          label: col.color,
          value: col.id
        }))
      );
      setSizesOptions(res.sizes);
    } catch (e: any) {
      showApiError(e, 'Error loading the planned fabric options.');
    } finally {
      setLoading({ fetching: false });
    }
  };

  const updateFabricBundle = async (data: FormReleaseBundle) => {
    try {
      setLoading({ saving: true });
      await StyleBundleService.updateFabricBundle(styleBundle?.id?.toString() ?? '', {
        style_planned_fabric_id: data.style_planned_fabric_id,
        style_planned_fabric_size_id: data.style_planned_fabric_size_id,
        quantity: data.quantity,
        remarks: data.remarks
      });
      showSuccess('Bundle successfully saved.');
    } catch (e: any) {
      showApiError(e, 'Error update record.');
    } finally {
      setLoading({ saving: false });
    }
  };

  const fetchStyleBundle = useCallback(async () => {
    try {
      setLoading({ fetching: true });
      const { data } = await StyleBundleService.getFabricBundle(params?.id);
      setStyleBunle(data);
    } catch (e: any) {
      showApiError(e, 'Error saving production process.');
    } finally {
      setLoading({ fetching: false });
    }
  }, [params?.id]);

  useEffect(() => {
    if (styleBundle) {
      setFormData({
        style_planned_fabric_id: styleBundle?.style_planned_fabric_id.toString() ?? '',
        style_planned_fabric_size_id: styleBundle?.style_planned_fabric_size_id.toString() ?? '',
        quantity: styleBundle.quantity,
        remarks: styleBundle.remarks ?? ''
      });
      fetchPlannedFabics(styleBundle.style_id.toString() ?? '');
    }
  }, [styleBundle]);

  useEffect(() => {
    if (params?.id) {
      fetchStyleBundle();
    }
  }, [params?.id]);

  return (
    <div className="grid">
      <div className="col-6">
        <PageCard title="Edit Bundle" toolbar={<PageAction actionBack={() => router.push(ROUTES.BUNDLES.INDEX)} actions={[PageActions.BACK]} />}>
          <div className="grid">
            <div className="col-12">
              <div className="p-fluid">
                <FormBundle onSubmit={updateFabricBundle} value={formData} colorOptions={colorOptions} sizesOptions={sizesOptions}>
                  <div className="grid">
                    <div className="ml-auto">
                      <FormAction
                        loadingSave={state.loadings?.saving || state.loadings?.fetching}
                        actionCancel={() => router.push(ROUTES.BUNDLES.INDEX)}
                        actions={[FormActions.CANCEL, FormActions.SAVE]}
                      />
                    </div>
                  </div>
                </FormBundle>
              </div>
            </div>
          </div>
        </PageCard>
      </div>
    </div>
  );
};

export default EditBundlePage;
