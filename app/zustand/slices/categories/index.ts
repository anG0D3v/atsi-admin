import { type StateCreator } from 'zustand';
import { MESSAGES, STATUS, STATUS_CODES } from '@/config/utils/constants';
import { customAlert, executeOnProcess } from '@/config/utils/util';
import { type ICategoriesDTO } from '@/interfaces/global';
import CategoriesServices from '@/services/categories';

interface CategoriesState {
  loading: boolean;
  items: ICategoriesDTO[] | undefined;
  responseMsg: string | null;
}

export interface CategoriesSlice {
  categories: CategoriesState | null;
  fetchCategories: (payload: any) => Promise<void>;
  addCategory: (payload: any) => Promise<void>;
  updateCategory: (payload: any) => Promise<void>;
  deleteCategory: (payload: any) => Promise<void>;
  restoreCategory: (payload:any) => void;
}

const initialState: CategoriesState = {
  loading: false,
  items: [],
  responseMsg: '',
};

const createCategoriesSlice: StateCreator<CategoriesSlice> = (set) => ({
  categories: initialState,
  fetchCategories: async (payload) => {
    try {
      set((state) => ({
        ...state,
        categories: {
          ...state.categories,
          loading: false,
          items: payload,
        },
      }));
    } catch (error) {
      set((state) => ({
        categories: {
          ...state.categories,
          loading: false,
          responseMsg: error.response.data.message,
        },
      }));
    }
  },

  addCategory: async (payload) => {
    try {
      set((state) => ({
        ...state,
        categories: {
          ...state.categories,
          loading: true,
        },
      }));

      const process = await executeOnProcess(() =>
        customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
      );
      const response = await CategoriesServices.addCategory(payload);

      if (response.status === STATUS_CODES.OK && process) {
        if (!('message' in response.data)) {
          set((state) => ({
            ...state,
            categories: {
              ...state.categories,
              loading: false,
              items: [response?.data?.data, ...state.categories.items],
            },
          }));
          customAlert('success', MESSAGES.SUCCESS, MESSAGES.ADDED);
        } else {
          set((state) => ({
            ...state,
            categories: {
              ...state.categories,
              loading: false,
            },
          }));
          customAlert('error', MESSAGES.ERROR, response?.data?.message);
        }
      }
    } catch (error) {
      set((state) => ({
        categories: {
          ...state.categories,
          loading: false,
          responseMsg: error.response.data.message,
        },
      }));
      customAlert('error', MESSAGES.ERROR, error.response.data.message);
    }
  },

  updateCategory: async (payload) => {
    try {
      set((state) => ({
        ...state,
        categories: {
          ...state.categories,
          loading: true,
        },
      }));

      const process = await executeOnProcess(() =>
        customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
      );

      const response = await CategoriesServices.updateCategory(payload);
      if (response.status === STATUS_CODES.OK && process) {
        if (!('message' in response.data)) {
          set((state) => ({
            ...state,
            categories: {
              ...state.categories,
              loading: false,
              items: state.categories.items?.map((item) =>
                item?.id === response?.data?.data?.id
                  ? response.data?.data
                  : item,
              ),
            },
          }));
          customAlert('success', MESSAGES.SUCCESS, MESSAGES.UPDATE);
        } else {
          set((state) => ({
            ...state,
            categories: {
              ...state.categories,
              loading: false,
            },
          }));
          customAlert('error', MESSAGES.ERROR, response?.data?.message);
        }
      }
    } catch (error) {
      set((state) => ({
        categories: {
          ...state.categories,
          loading: false,
          responseMsg: error.response.data.message,
        },
      }));
      customAlert('error', MESSAGES.ERROR, error.response.data.message);
    }
  },

  deleteCategory: async (payload) => {
    try {
      set((state) => ({
        ...state,
        categories: {
          ...state.categories,
          loading: true,
        },
      }));

      const process = await executeOnProcess(() =>
        customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
      );

      const response = await CategoriesServices.deleteCategory(payload);
      if (response.status === STATUS_CODES.OK && process) {
        if (!('message' in response.data)) {
          set((state) => ({
            ...state,
            categories: {
              ...state.categories,
              loading: false,
              items: state.categories.items?.map((item) =>
                item?.id === response?.data?.data?.id
                  ? response?.data?.data
                  : item,
              ),
            },
          }));
          customAlert(
            'success',
            MESSAGES.SUCCESS,
            response?.data?.data?.status === STATUS.AVAILABLE
              ? MESSAGES.RESTORED
              : MESSAGES.DELETED,
          );
        } else {
          set((state) => ({
            ...state,
            categories: {
              ...state.categories,
              loading: false,
            },
          }));
          customAlert('error', MESSAGES.ERROR, response?.data?.message);
        }
      }
    } catch (error) {
      set((state) => ({
        categories: {
          ...state.categories,
          loading: false,
          responseMsg: error.response.data.message,
        },
      }));
      customAlert('error', MESSAGES.ERROR, error.response.data.message);
    }
  },
  restoreCategory: async (payload) => {
    try {
      set((state) => ({
        ...state,
        categories: {
          ...state.categories,
          loading: true,
        },
      }));

      const process = await executeOnProcess(() =>
        customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
      );

      const response = await CategoriesServices.restoreCategories(payload);
      if (response.status === STATUS_CODES.OK && process) {
        if (!('message' in response.data)) {
          customAlert(
            'success',
            MESSAGES.SUCCESS,
            response?.data?.data?.status === STATUS.AVAILABLE
              ? MESSAGES.RESTORED
              : MESSAGES.DELETED,
          );
        } else {
          set((state) => ({
            ...state,
            categories: {
              ...state.categories,
              loading: false,
            },
          }));
          customAlert('error', MESSAGES.ERROR, response?.data?.message);
        }
      }
    } catch (error) {
      set((state) => ({
        categories: {
          ...state.categories,
          loading: false,
          responseMsg: error.response.data.message,
        },
      }));
      customAlert('error', MESSAGES.ERROR, error.response.data.message);
    }
  },
});

export default createCategoriesSlice;
