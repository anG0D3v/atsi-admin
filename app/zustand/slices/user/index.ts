import { type StateCreator } from 'zustand/vanilla';
import { UserServices } from '@/services';

interface UserState {
  loading: boolean;
  info: object;
  responseMsg: string;
}
export interface UserSlice {
  user: UserState | null;
  login: (payload: any) => void;
  getUserByEmail: (payload: string) => void;
  saveUserInfo: (payload: any) => void;
}

const initialState: UserState = {
  loading: false,
  info: null,
  responseMsg: '',
};

const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: initialState,
  login: async (payload: any) => {
    try {
      const response = await UserServices.login(payload);
      if (response.status === 200) {
        if (!('message' in response.data)) {
          set((state) => ({ user: response?.data?.data }));
          return response;
        }
      }
    } catch (error) {
      console.log('Error at: ', error);
    }
  },
  getUserByEmail: async (payload: string) => {
    try {
      const response = await UserServices.getUserByEmal(payload);
      if (response.status === 200) {
        if (!('message' in response.data)) {
          set((state) => ({ user: response?.data?.data }));
        }
      }
    } catch (error) {
      console.log('Error at: ', error);
    }
  },
  saveUserInfo: async (payload: any) => {
    try {
      set((state) => ({
        ...state,
        user: {
          ...state.user,
          info: null,
          loading: true,
          responseMsg: '',
        },
      }));

      const process = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      });

      if (typeof payload !== 'string' && process) {
        set((state) => ({
          ...state,
          user: {
            ...state.user,
            info: payload,
            loading: false,
            responseMsg: '',
          },
        }));
      }
    } catch (error) {
      console.log('Error at: ', error);
      set((state) => ({
        ...state,
        user: {
          ...state.user,
          info: null,
          loading: false,
          responseMsg: 'Invalid Credentials',
        },
      }));
    }
  },
});

export default createUserSlice;
