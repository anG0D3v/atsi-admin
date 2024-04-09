import { type StateCreator } from 'zustand';
import { MESSAGES, STATUS, STATUS_CODES } from '@/config/utils/constants';
import { customAlert, executeOnProcess } from '@/config/utils/util';
import { type IAboutUs } from '@/interfaces/global';
import AboutUsServices from '@/services/aboutUs';

interface AboutState {
    loading: boolean;
    list: IAboutUs[] | undefined;
    responseMsg: string | null;
  }
  
  export interface AboutSlice {
    Abouts: AboutState | null;
    fetchAbouts: (payload: any) => Promise<void>;
    deleteAbouts: (payload: any) => Promise<void>;
    addAbouts: (payload: any) => Promise<void>;
    updateAbouts: (payload: any) => Promise<void>;
    setInactiveActive:(payload:any,status:string) => Promise<void>;
    restoreAbouts: (payload: any) => Promise<void>;
  }
  
  const initialState: AboutState = {
    loading: false,
    list: [],
    responseMsg: '',
  };
  
  const createAboutSlice: StateCreator<AboutSlice> = (set) => ({
    Abouts: initialState,
    fetchAbouts: async (payload) => {
      try {
        set((state) => ({
          ...state,
          Abouts: {
            ...state.Abouts,
            loading: false,
            list: payload,
          },
        }));
      } catch (error) {
        set((state) => ({
          Abouts: {
            ...state.Abouts,
            loading: false,
            responseMsg: error.response.data.message,
          },
        }));
      }
    },
    deleteAbouts: async (payload) =>{
      try {
          set((state) => ({
              ...state,
              Abouts: {
                ...state.Abouts,
                loading: true,
              },
            }));
      
            const process = await executeOnProcess(() =>
              customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
            );
            const response = await AboutUsServices.deleteAboutUs(payload);
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
                  Abouts: {
                    ...state.Abouts,
                    loading: false,
                  },
                }));
                customAlert('error', MESSAGES.ERROR, response?.data?.message);
              }
            }
      } catch (error) {
          set((state) => ({
            Abouts: {
                ...state.Abouts,
                loading: false,
                responseMsg: error.response.data.message,
              },
            }));
            customAlert('error', MESSAGES.ERROR, error.response.data.message);    
      }
    },
    addAbouts: async (payload) =>{
      try {
        set((state) => ({
          ...state,
          Abouts: {
            ...state.Abouts,
            loading: true,
          },   
        }))
        const process = await executeOnProcess(() =>
        customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),);
  
        const response = await AboutUsServices.addAboutUs(payload)
        if (response.status === STATUS_CODES.OK && process) {
          if (!('message' in response.data)) {
            set((state) => ({
              ...state,
              Abouts: {
                ...state.Abouts,
                loading: false,
                list: [response?.data?.data, ...state.Abouts.list],
              },
            }));
            customAlert('success', MESSAGES.SUCCESS, MESSAGES.ADDED);
          } else {
            set((state) => ({
              ...state,
              Abouts: {
                ...state.Abouts,
                loading: false,
              },
            }));
            customAlert('error', MESSAGES.ERROR, response?.data?.message);
          }
        }
        
      } catch (error) {
        set((state) => ({
          Abouts: {
            ...state.Abouts,
            loading: false,
            responseMsg: error.response.data.message,
          },
        }));
        customAlert('error', MESSAGES.ERROR, error.response.data.message);     
      }
    },
    updateAbouts: async(payload) =>{
    try {
          set((state) => ({
            ...state,
            Abouts: {
              ...state.Abouts,
              loading: true,
            },
          }));
      
          const process = await executeOnProcess(() =>
            customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
          );
      
          const response = await AboutUsServices.updateAboutUs(payload)
          if (response.status === STATUS_CODES.OK && process) {
            if (!('message' in response.data)) {
              set((state) => ({
                ...state,
                Abouts: {
                  ...state.Abouts,
                  loading: false,
                  list: state.Abouts.list?.map((item) =>
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
                Abouts: {
                  ...state.Abouts,
                  loading: false,
                },
              }));
              customAlert('error', MESSAGES.ERROR, response?.data?.message);
            }
          }
    } catch (error) {
      set((state) => ({
        Abouts: {
          ...state.Abouts,
          loading: false,
          responseMsg: error.response.data.message,
        },
      }));
      customAlert('error', MESSAGES.ERROR, error.response.data.message);
    }
    },
    restoreAbouts: async (payload) =>{
      try {
          set((state) => ({
              ...state,
              Abouts: {
                ...state.Abouts,
                loading: true,
              },
            }));
      
            const process = await executeOnProcess(() =>
              customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
            );
            const response = await AboutUsServices.restoreAboutUs(payload);
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
                  Abouts: {
                    ...state.Abouts,
                    loading: false,
                  },
                }));
                customAlert('error', MESSAGES.ERROR, response?.data?.message);
              }
            }
      } catch (error) {
          set((state) => ({
            Abouts: {
                ...state.Abouts,
                loading: false,
                responseMsg: error.response.data.message,
              },
            }));
            customAlert('error', MESSAGES.ERROR, error.response.data.message);    
      }
    },
    setInactiveActive:async(payload: any,status: string) =>{
      try {
        set((state) => ({
          Abouts: {
              ...state.Abouts,
              loading: true,
            },
          }));
        const response = status === 'Inactive' ? await AboutUsServices.setActiveAbouts(payload) 
        : await AboutUsServices.setInActiveAbouts(payload)
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
              Abouts: {
                ...state.Abouts,
                loading: false,
              },
            }));
            customAlert('error', MESSAGES.ERROR, response?.data?.message);
          }
        }
      } catch (error) {
        set((state) => ({
          Abouts: {
              ...state.Abouts,
              loading: false,
              responseMsg: error.response.data.message,
            },
          }));
          customAlert('error', MESSAGES.ERROR, error.response.data.message);   
      }
    }
  });
  
  export default createAboutSlice;