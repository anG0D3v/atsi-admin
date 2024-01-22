import { type StateCreator } from 'zustand';
// import { MESSAGES, STATUS, STATUS_CODES } from '@/config/utils/constants';
// import { customAlert, executeOnProcess } from '@/config/utils/util';
import { MESSAGES, STATUS_CODES } from '@/config/utils/constants';
import { customAlert, executeOnProcess } from '@/config/utils/util';
import { type IProductsDTO } from '@/interfaces/global';
import { ProductsService } from '@/services';
// import { ProductsService } from '@/services';

interface ProductsState {
  loading: boolean;
  items: IProductsDTO[] | undefined;
  responseMsg: string | null;
}

export interface ProductsSlice {
  products: ProductsState | null;
  loadProducts: (payload: any) => void;
  addProduct: (payload: any) => void;
  //   updateProduct: (payload: any) => void;
  //   deleteProduct: (payload: any) => void;
}

const initialState: ProductsState = {
  loading: false,
  items: null,
  responseMsg: '',
};

const createProductsSlice: StateCreator<ProductsSlice> = (set) => ({
  products: initialState,
  loadProducts: async (payload) => {
    try {
      set((state) => ({
        ...state,
        products: {
          ...state.products,
          loading: false,
          items: payload,
        },
      }));
    } catch (error) {
      set((state) => ({
        products: {
          ...state.products,
          loading: false,
          responseMsg: error.response.data.message,
        },
      }));
    }
  },

  addProduct: async (payload) => {
    try {
      set((state) => ({
        ...state,
        products: {
          ...state.products,
          loading: true,
        },
      }));

      const process = await executeOnProcess(() =>
        customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
      );
      const response = await ProductsService.addProduct(payload);

      if (response.status === STATUS_CODES.OK && process) {
        if (!('message' in response.data)) {
          set((state) => ({
            ...state,
            products: {
              ...state.products,
              loading: false,
              items: [response?.data?.data, ...state.products.items],
            },
          }));
          customAlert('success', MESSAGES.SUCCESS, MESSAGES.ADDED);
        } else {
          set((state) => ({
            ...state,
            products: {
              ...state.products,
              loading: false,
            },
          }));
          customAlert('error', MESSAGES.ERROR, response?.data?.message);
        }
      }
    } catch (error) {
      set((state) => ({
        products: {
          ...state.products,
          loading: false,
          responseMsg: error.response.data.message,
        },
      }));
      customAlert('error', MESSAGES.ERROR, error.response.data.message);
    }
  },
});

export default createProductsSlice;
