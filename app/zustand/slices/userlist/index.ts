import { type StateCreator } from 'zustand';
import { MESSAGES, STATUS, STATUS_CODES } from '@/config/utils/constants';
import { customAlert, executeOnProcess } from '@/config/utils/util';
import { type IUserDTO } from '@/interfaces/global';
import UserListSevices from '@/services/userList';

interface UserListState {
  loading: boolean;
  list: IUserDTO[] | undefined;
  responseMsg: string | null;
}

export interface UserListSlice {
  userList: UserListState | null;
  fetchUserList: (payload: any) => Promise<void>;
  deleteUser: (payload: any) => Promise<void>;
}

const initialState: UserListState = {
  loading: false,
  list: [],
  responseMsg: '',
};

const createUserListSlice: StateCreator<UserListSlice> = (set) => ({
  userList: initialState,
  fetchUserList: async (payload) => {
    try {
      set((state) => ({
        ...state,
        userList: {
          ...state.userList,
          loading: false,
          list: payload,
        },
      }));
    } catch (error) {
      set((state) => ({
        userList: {
          ...state.userList,
          loading: false,
          responseMsg: error.response.data.message,
        },
      }));
    }
  },
  deleteUser: async (payload) =>{
    console.log(payload)
    try {
        set((state) => ({
            ...state,
            userList: {
              ...state.userList,
              loading: true,
            },
          }));
    
          const process = await executeOnProcess(() =>
            customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
          );
          const response = await UserListSevices.deleteUser(payload);
          if (response.status === STATUS_CODES.OK && process) {
            if (!('message' in response.data)) {
              set((state) => ({
                ...state,
                categories: {
                  ...state.userList,
                  loading: false,
                  list: state.userList.list?.map((item) =>
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
                userList: {
                  ...state.userList,
                  loading: false,
                },
              }));
              customAlert('error', MESSAGES.ERROR, response?.data?.message);
            }
          }
    } catch (error) {
        set((state) => ({
            userList: {
              ...state.userList,
              loading: false,
              responseMsg: error.response.data.message,
            },
          }));
          customAlert('error', MESSAGES.ERROR, error.response.data.message);    
    }
  }
});

export default createUserListSlice;
