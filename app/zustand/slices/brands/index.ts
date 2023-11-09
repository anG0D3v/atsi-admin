import { type StateCreator } from 'zustand';
import { MESSAGES, STATUS, STATUS_CODES } from '@/config/utils/constants';
import { customAlert, executeOnProcess } from '@/config/utils/util';
import { type IBrandDTO } from '@/interfaces/global';
import { BrandServices } from '@/services';

interface BrandsState {
  loading: boolean;
  items: IBrandDTO[] | undefined;
  responseMsg: string | null;
}

export interface BrandsSlice {
  brands: BrandsState | null;
  loadBrands: (payload: any) => void;
  addBrand: (payload: any) => void;
  updateBrand: (payload: any) => void;
  deleteBrand: (payload: any) => void;
}

const initialState: BrandsState = {
  loading: false,
  items: null,
  responseMsg: '',
};

const createBrandSlice: StateCreator<BrandsSlice> = (set) => ({
  brands: initialState,
  loadBrands: async (payload) => {
    try {
      set((state) => ({
        ...state,
        brands: {
          ...state.brands,
          loading: false,
          items: payload,
        },
      }));
    } catch (error) {
      set((state) => ({
        brands: {
          ...state.brands,
          loading: false,
          responseMsg: error.response.data.message,
        },
      }));
    }
  },
  addBrand: async (payload) => {
    try {
      set((state) => ({
        ...state,
        brands: {
          ...state.brands,
          loading: true,
        },
      }));

      const process = await executeOnProcess(() =>
        customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
      );
      const response = await BrandServices.addBrand(payload);

      if (response.status === STATUS_CODES.OK && process) {
        if (!('message' in response.data)) {
          set((state) => ({
            ...state,
            brands: {
              ...state.brands,
              loading: false,
              items: [response?.data?.data, ...state.brands.items],
            },
          }));
          customAlert('success', MESSAGES.SUCCESS, MESSAGES.ADDED);
        } else {
          set((state) => ({
            ...state,
            brands: {
              ...state.brands,
              loading: false,
            },
          }));
          customAlert('error', MESSAGES.ERROR, response?.data?.message);
        }
      }
    } catch (error) {
      set((state) => ({
        brands: {
          ...state.brands,
          loading: false,
          responseMsg: error.response.data.message,
        },
      }));
      customAlert('error', MESSAGES.ERROR, error.response.data.message);
    }
  },
  updateBrand: async (payload) => {
    try {
      set((state) => ({
        ...state,
        brands: {
          ...state.brands,
          loading: true,
        },
      }));

      const process = await executeOnProcess(() =>
        customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
      );

      const response = await BrandServices.updateBrand(payload);
      if (response.status === STATUS_CODES.OK && process) {
        if (!('message' in response.data)) {
          set((state) => ({
            ...state,
            brands: {
              ...state.brands,
              loading: false,
              items: state.brands.items?.map((item) =>
                item?.id === response?.data?.data?.id
                  ? response?.data?.data
                  : item,
              ),
            },
          }));
          customAlert('success', MESSAGES.SUCCESS, MESSAGES.UPDATE);
        } else {
          set((state) => ({
            ...state,
            brands: {
              ...state.brands,
              loading: false,
            },
          }));
          customAlert('error', MESSAGES.ERROR, response?.data?.message);
        }
      }
    } catch (error) {
      set((state) => ({
        brands: {
          ...state.brands,
          loading: false,
          responseMsg: error.response.data.message,
        },
      }));
      customAlert('error', MESSAGES.ERROR, error.response.data.message);
    }
  },

  deleteBrand: async (payload) => {
    try {
      set((state) => ({
        ...state,
        brands: {
          ...state.brands,
          loading: true,
        },
      }));

      const process = await executeOnProcess(() =>
        customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
      );

      const response = await BrandServices.deleteBrand(payload);
      if (response.status === STATUS_CODES.OK && process) {
        if (!('message' in response.data)) {
          set((state) => ({
            ...state,
            brands: {
              ...state.brands,
              loading: false,
              items: state.brands.items?.map((item) =>
                item?.id === response?.data?.data?.id
                  ? response?.data?.data
                  : item,
              ),
            },
          }));
          customAlert(
            'success',
            MESSAGES.SUCCESS,
            response?.data?.data?.status === STATUS.ACTIVE
              ? MESSAGES.RESTORED
              : MESSAGES.DELETED,
          );
        } else {
          set((state) => ({
            ...state,
            brands: {
              ...state.brands,
              loading: false,
            },
          }));
          customAlert('error', MESSAGES.ERROR, response?.data?.message);
        }
      }
    } catch (error) {
      set((state) => ({
        brands: {
          ...state.brands,
          loading: false,
          responseMsg: error.response.data.message,
        },
      }));
      customAlert('error', MESSAGES.ERROR, error.response.data.message);
    }
  },
});

export default createBrandSlice;
