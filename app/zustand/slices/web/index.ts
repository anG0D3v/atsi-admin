import { type StateCreator } from 'zustand';
import { MESSAGES, STATUS, STATUS_CODES } from '@/config/utils/constants';
import { customAlert, executeOnProcess } from '@/config/utils/util';
import { type IWebDTO } from '@/interfaces/global';
import WebServices from '@/services/web';

interface WebState {
    loading: boolean;
    blogs: IWebDTO[] | undefined;
    responseMsg: string | null;
  }
  
  export interface WebSlice {
    Blogs: WebState | null;
    fetchBlogs: (payload: any) => Promise<void>;
    deleteBlogs: (payload: any) => Promise<void>;
    addBlogs: (payload: any) => Promise<void>;
    updateBlogs: (payload: any) => Promise<void>;
    restoreBlogs: (payload: any) => Promise<void>;
  }
  
  const initialState: WebState = {
    loading: false,
    blogs: [],
    responseMsg: '',
  };
  
  const createWebSlice: StateCreator<WebSlice> = (set) => ({
    Blogs: initialState,
    fetchBlogs: async (payload) => {
      try {
        set((state) => ({
          ...state,
          Blogs: {
            ...state.Blogs,
            loading: false,
            blogs: payload,
          },
        }));
      } catch (error) {
        set((state) => ({
          Blogs: {
            ...state.Blogs,
            loading: false,
            responseMsg: error.response.data.message,
          },
        }));
      }
    },
    deleteBlogs: async (payload) =>{
      try {
          set((state) => ({
              ...state,
              Blogs: {
                ...state.Blogs,
                loading: true,
              },
            }));
      
            const process = await executeOnProcess(() =>
              customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
            );
            const response = await WebServices.deleteBlogs(payload);
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
                  Blogs: {
                    ...state.Blogs,
                    loading: false,
                  },
                }));
                customAlert('error', MESSAGES.ERROR, response?.data?.message);
              }
            }
      } catch (error) {
          set((state) => ({
            Blogs: {
                ...state.Blogs,
                loading: false,
                responseMsg: error.response.data.message,
              },
            }));
            customAlert('error', MESSAGES.ERROR, error.response.data.message);    
      }
    },
    addBlogs: async (payload) =>{
      try {
        set((state) => ({
          ...state,
          Blogs: {
            ...state.Blogs,
            loading: true,
          },   
        }))
        const process = await executeOnProcess(() =>
        customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),);
  
        const response = await WebServices.addBlogs(payload)
        if (response.status === STATUS_CODES.OK && process) {
          if (!('message' in response.data)) {
            set((state) => ({
              ...state,
              Blogs: {
                ...state.Blogs,
                loading: false,
                blogs: [response?.data?.data, ...state.Blogs.blogs],
              },
            }));
            customAlert('success', MESSAGES.SUCCESS, MESSAGES.ADDED);
          } else {
            set((state) => ({
              ...state,
              Blogs: {
                ...state.Blogs,
                loading: false,
              },
            }));
            customAlert('error', MESSAGES.ERROR, response?.data?.message);
          }
        }
        
      } catch (error) {
        set((state) => ({
          Blogs: {
            ...state.Blogs,
            loading: false,
            responseMsg: error.response.data.message,
          },
        }));
        customAlert('error', MESSAGES.ERROR, error.response.data.message);     
      }
    },
    updateBlogs: async(payload) =>{
    try {
          set((state) => ({
            ...state,
            Blogs: {
              ...state.Blogs,
              loading: true,
            },
          }));
      
          const process = await executeOnProcess(() =>
            customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
          );
      
          const response = await WebServices.updateBlogs(payload)
          if (response.status === STATUS_CODES.OK && process) {
            if (!('message' in response.data)) {
              set((state) => ({
                ...state,
                Blogs: {
                  ...state.Blogs,
                  loading: false,
                  blogs: state.Blogs.blogs?.map((item) =>
                    item?.id === response?.data?.data?.id
                      ? response.data?.data
                      : item,
                  ),
                },
              }));
              customAlert('success', MESSAGES.SUCCESS, MESSAGES.UPDATE);
              return response?.data?.data
            } else {
              set((state) => ({
                ...state,
                Blogs: {
                  ...state.Blogs,
                  loading: false,
                },
              }));
              customAlert('error', MESSAGES.ERROR, response?.data?.message);
            }
          }
    } catch (error) {
      set((state) => ({
        Blogs: {
          ...state.Blogs,
          loading: false,
          responseMsg: error.response.data.message,
        },
      }));
      customAlert('error', MESSAGES.ERROR, error.response.data.message);
    }
    },
    restoreBlogs: async (payload) =>{
      try {
          set((state) => ({
              ...state,
              Blogs: {
                ...state.Blogs,
                loading: true,
              },
            }));
      
            const process = await executeOnProcess(() =>
              customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
            );
            const response = await WebServices.restoreBlogs(payload);
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
                  Blogs: {
                    ...state.Blogs,
                    loading: false,
                  },
                }));
                customAlert('error', MESSAGES.ERROR, response?.data?.message);
              }
            }
      } catch (error) {
          set((state) => ({
            Blogs: {
                ...state.Blogs,
                loading: false,
                responseMsg: error.response.data.message,
              },
            }));
            customAlert('error', MESSAGES.ERROR, error.response.data.message);    
      }
    },
  });
  
  export default createWebSlice;