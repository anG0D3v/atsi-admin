import { type StateCreator } from 'zustand';
import { MESSAGES, STATUS, STATUS_CODES } from '@/config/utils/constants';
import { customAlert, executeOnProcess } from '@/config/utils/util';
import { type ILandingPage } from '@/interfaces/global';
import LandingPageServices from '@/services/landingPage';

interface LandingState {
    loading: boolean;
    list: ILandingPage[] | undefined;
    responseMsg: string | null;
  }
  
  export interface LandingSlice {
    Landingpage: LandingState | null;
    fetchContent: (payload: any) => Promise<void>;
    deleteContent: (payload: any) => Promise<void>;
    addContent: (payload: any) => Promise<void>;
    updateContent: (payload: any) => Promise<void>;
    setInactiveActiveContent:(payload:any,status:string) => Promise<void>;
    restoreContent: (payload: any) => Promise<void>;
    deleteContentImg: (payload: any) => void;
  }
  
  const initialState: LandingState = {
    loading: false,
    list: [],
    responseMsg: '',
  };
  
  const createLandingSlice: StateCreator<LandingSlice> = (set) => ({
    Landingpage: initialState,
    fetchContent: async (payload) => {
      try {
        set((state) => ({
          ...state,
          Landingpage: {
            ...state.Landingpage,
            loading: false,
            list: payload,
          },
        }));
      } catch (error) {
        set((state) => ({
            Landingpage: {
            ...state.Landingpage,
            loading: false,
            responseMsg: error.response.data.message,
          },
        }));
      }
    },
    deleteContent: async (payload) =>{
      try {
          set((state) => ({
              ...state,
              Abouts: {
                ...state.Landingpage,
                loading: true,
              },
            }));
      
            const process = await executeOnProcess(() =>
              customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
            );
            const response = await LandingPageServices.deleteContent(payload);
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
                  Landingpage: {
                    ...state.Landingpage,
                    loading: false,
                  },
                }));
                customAlert('error', MESSAGES.ERROR, response?.data?.message);
              }
            }
      } catch (error) {
          set((state) => ({
            Landingpage: {
                ...state.Landingpage,
                loading: false,
                responseMsg: error.response.data.message,
              },
            }));
            customAlert('error', MESSAGES.ERROR, error.response.data.message);    
      }
    },
    addContent: async (payload) =>{
      try {
        set((state) => ({
          ...state,
          Landingpage: {
            ...state.Landingpage,
            loading: true,
          },   
        }))
        const process = await executeOnProcess(() =>
        customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),);
  
        const response = await LandingPageServices.addContent(payload)
        if (response.status === STATUS_CODES.OK && process) {
          if (!('message' in response.data)) {
            set((state) => ({
              ...state,
              Landingpage: {
                ...state.Landingpage,
                loading: false,
                list: [response?.data?.data, ...state.Landingpage.list],
              },
            }));
            customAlert('success', MESSAGES.SUCCESS, MESSAGES.ADDED);
          } else {
            set((state) => ({
              ...state,
              Landingpage: {
                ...state.Landingpage,
                loading: false,
              },
            }));
            customAlert('error', MESSAGES.ERROR, response?.data?.message);
          }
        }
        
      } catch (error) {
        set((state) => ({
            Landingpage: {
            ...state.Landingpage,
            loading: false,
            responseMsg: error.response.data.message,
          },
        }));
        customAlert('error', MESSAGES.ERROR, error.response.data.message);     
      }
    },
    updateContent: async(payload) =>{
    try {
          set((state) => ({
            ...state,
            Landingpage: {
              ...state.Landingpage,
              loading: true,
            },
          }));
      
          const process = await executeOnProcess(() =>
            customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
          );
      
          const response = await LandingPageServices.updateContent(payload)
          if (response.status === STATUS_CODES.OK && process) {
            if (!('message' in response.data)) {
              set((state) => ({
                ...state,
                Landingpage: {
                  ...state.Landingpage,
                  loading: false,
                  list: state.Landingpage.list?.map((item) =>
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
                Landingpage: {
                  ...state.Landingpage,
                  loading: false,
                },
              }));
              customAlert('error', MESSAGES.ERROR, response?.data?.message);
            }
          }
    } catch (error) {
      set((state) => ({
        Landingpage: {
          ...state.Landingpage,
          loading: false,
          responseMsg: error.response.data.message,
        },
      }));
      customAlert('error', MESSAGES.ERROR, error.response.data.message);
    }
    },
    restoreContent: async (payload) =>{
      try {
          set((state) => ({
              ...state,
              Landingpage: {
                ...state.Landingpage,
                loading: true,
              },
            }));
      
            const process = await executeOnProcess(() =>
              customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
            );
            const response = await LandingPageServices.restoreContent(payload);
            if (response.status === STATUS_CODES.OK && process) {
              if (!('message' in response.data)) {
                customAlert(
                  'success',
                  MESSAGES.SUCCESS,
                  MESSAGES.RESTORED,
                );
              } else {
                set((state) => ({
                  ...state,
                  Landingpage: {
                    ...state.Landingpage,
                    loading: false,
                  },
                }));
                customAlert('error', MESSAGES.ERROR, response?.data?.message);
              }
            }
      } catch (error) {
          set((state) => ({
            Landingpage: {
                ...state.Landingpage,
                loading: false,
                responseMsg: error.response.data.message,
              },
            }));
            customAlert('error', MESSAGES.ERROR, error.response.data.message);    
      }
    },
    setInactiveActiveContent:async(payload: any,status: string) =>{
      try {
        set((state) => ({
            Landingpage: {
              ...state.Landingpage,
              loading: true,
            },
          }));
        const response = status === 'Inactive' ? await LandingPageServices.setActiveContent(payload) 
        : await LandingPageServices.setInActiveContent(payload)
        if (response.status === STATUS_CODES.OK && process) {
          if (!('message' in response.data)) {
            customAlert('success', MESSAGES.SUCCESS, MESSAGES.UPDATE);
          } else {
            set((state) => ({
              ...state,
              Landingpage: {
                ...state.Landingpage,
                loading: false,
              },
            }));
            customAlert('error', MESSAGES.ERROR, response?.data?.message);
          }
        }
      } catch (error) {
        set((state) => ({
            Landingpage: {
              ...state.Landingpage,
              loading: false,
              responseMsg: error.response.data.message,
            },
          }));
          customAlert('error', MESSAGES.ERROR, error.response.data.message);   
      }
    },
    deleteContentImg: async(payload) =>{
      try {
        set((state) => ({
          ...state,
          Landingpage: {
            ...state.Landingpage,
            loading: true,
          },
        }));
        const process = await executeOnProcess(() =>
        customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
      );
      const response = await LandingPageServices.deleteContentImg(payload)     
      if (response.status === STATUS_CODES.OK && process) {
        if (!('message' in response.data)) {
          set((state) => ({
            ...state,
            Landingpage: {
              ...state.Landingpage,
              loading: false,
            },
          }));
          customAlert('success', MESSAGES.SUCCESS, MESSAGES.DELETED);
          return response.data.data
        } else {
          set((state) => ({
            ...state,
            Landingpage: {
              ...state.Landingpage,
              loading: false,
            },
          }));
          customAlert('error', MESSAGES.ERROR, response?.data?.message);
          return null;
        }
      }    
      } catch (error) {
        console.log(error)
      }
    },
  });
  
  export default createLandingSlice;