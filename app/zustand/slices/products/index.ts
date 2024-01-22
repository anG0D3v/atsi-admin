import { type StateCreator } from 'zustand';
// import { MESSAGES, STATUS, STATUS_CODES } from '@/config/utils/constants';
// import { customAlert, executeOnProcess } from '@/config/utils/util';
import { type IProductsDTO } from '@/interfaces/global';
// import { ProductsService } from '@/services';

interface ProductsState {
  loading: boolean;
  items: IProductsDTO[] | undefined;
  responseMsg: string | null;
}

export interface ProductsSlice {
  products: ProductsState | null;
  loadProducts: (payload: any) => void;
  //   addProduct: (payload: any) => void;
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
});

export default createProductsSlice;
