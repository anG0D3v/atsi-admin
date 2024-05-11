import { type StateCreator } from 'zustand';
import { MESSAGES, STATUS, STATUS_CODES } from '@/config/utils/constants';
import { customAlert, executeOnProcess } from '@/config/utils/util';
import { type IAboutUs } from '@/interfaces/global';
import SocialMediaServices from '@/services/socialMedia';

interface SocialState {
    loading: boolean;
    link: IAboutUs[] | undefined;
    responseMsg: string | null;
  }
  
  export interface SocialSlice {
    socialLinks: SocialState | null;
    fetchSocialLinks: (payload: any) => Promise<void>;
    deleteSocialLinks: (payload: any) => Promise<void>;
    addSocialLinks: (payload: any) => Promise<void>;
    updateSocialLinks: (payload: any) => Promise<void>;
    setInactiveActiveLinks:(payload:any,status:string) => Promise<void>;
    restoreSocialLinks: (payload: any) => Promise<void>;
  }
  
  const initialState: SocialState = {
    loading: false,
    link: [],
    responseMsg: '',
  };
  
  const createSocialSlice: StateCreator<SocialSlice> = (set) => ({
    socialLinks: initialState,
    fetchSocialLinks: async (payload) => {
      try {
        set((state) => ({
          ...state,
          socialLinks: {
            ...state.socialLinks,
            loading: false,
            link: payload,
          },
        }));
      } catch (error) {
        set((state) => ({
            socialLinks: {
            ...state.socialLinks,
            loading: false,
            responseMsg: error.response.data.message,
          },
        }));
      }
    },
    deleteSocialLinks: async (payload) =>{
      try {
          set((state) => ({
              ...state,
              Abouts: {
                ...state.socialLinks,
                loading: true,
              },
            }));
      
            const process = await executeOnProcess(() =>
              customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
            );
            const response = await SocialMediaServices.deleteSocialMedia(payload);
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
                  socialLinks: {
                    ...state.socialLinks,
                    loading: false,
                  },
                }));
                customAlert('error', MESSAGES.ERROR, response?.data?.message);
              }
            }
      } catch (error) {
          set((state) => ({
            socialLinks: {
                ...state.socialLinks,
                loading: false,
                responseMsg: error.response.data.message,
              },
            }));
            customAlert('error', MESSAGES.ERROR, error.response.data.message);    
      }
    },
    addSocialLinks: async (payload) =>{
      try {
        set((state) => ({
          ...state,
          socialLinks: {
            ...state.socialLinks,
            loading: true,
          },   
        }))
        const process = await executeOnProcess(() =>
        customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),);
  
        const response = await SocialMediaServices.addSocialMedia(payload)
        if (response.status === STATUS_CODES.OK && process) {
          if (!('message' in response.data)) {
            set((state) => ({
              ...state,
              socialLinks: {
                ...state.socialLinks,
                loading: false,
                link: [response?.data?.data, ...state.socialLinks.link],
              },
            }));
            customAlert('success', MESSAGES.SUCCESS, MESSAGES.ADDED);
          } else {
            set((state) => ({
              ...state,
              socialLinks: {
                ...state.socialLinks,
                loading: false,
              },
            }));
            customAlert('error', MESSAGES.ERROR, response?.data?.message);
          }
        }
        
      } catch (error) {
        set((state) => ({
            socialLinks: {
            ...state.socialLinks,
            loading: false,
            responseMsg: error.response.data.message,
          },
        }));
        customAlert('error', MESSAGES.ERROR, error.response.data.message);     
      }
    },
    updateSocialLinks: async(payload) =>{
    try {
          set((state) => ({
            ...state,
            socialLinks: {
              ...state.socialLinks,
              loading: true,
            },
          }));
      
          const process = await executeOnProcess(() =>
            customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
          );
      
          const response = await SocialMediaServices.updateSocialMedia(payload)
          if (response.status === STATUS_CODES.OK && process) {
            if (!('message' in response.data)) {
              set((state) => ({
                ...state,
                socialLinks: {
                  ...state.socialLinks,
                  loading: false,
                  link: state.socialLinks.link?.map((item) =>
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
                socialLinks: {
                  ...state.socialLinks,
                  loading: false,
                },
              }));
              customAlert('error', MESSAGES.ERROR, response?.data?.message);
            }
          }
    } catch (error) {
      set((state) => ({
        socialLinks: {
          ...state.socialLinks,
          loading: false,
          responseMsg: error.response.data.message,
        },
      }));
      customAlert('error', MESSAGES.ERROR, error.response.data.message);
    }
    },
    restoreSocialLinks: async (payload) =>{
      try {
          set((state) => ({
              ...state,
              socialLinks: {
                ...state.socialLinks,
                loading: true,
              },
            }));
      
            const process = await executeOnProcess(() =>
              customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
            );
            const response = await SocialMediaServices.restoreSocialMedia(payload);
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
                  socialLinks: {
                    ...state.socialLinks,
                    loading: false,
                  },
                }));
                customAlert('error', MESSAGES.ERROR, response?.data?.message);
              }
            }
      } catch (error) {
          set((state) => ({
            socialLinks: {
                ...state.socialLinks,
                loading: false,
                responseMsg: error.response.data.message,
              },
            }));
            customAlert('error', MESSAGES.ERROR, error.response.data.message);    
      }
    },
    setInactiveActiveLinks:async(payload: any,status: string) =>{
      try {
        set((state) => ({
            socialLinks: {
              ...state.socialLinks,
              loading: true,
            },
          }));
        const response = status === 'Inactive' ? await SocialMediaServices.setActiveSocialMedia(payload) 
        : await SocialMediaServices.setInActiveSocialMedia(payload)
        if (response.status === STATUS_CODES.OK && process) {
          if (!('message' in response.data)) {
            customAlert('success', MESSAGES.SUCCESS, MESSAGES.UPDATE);
          } else {
            set((state) => ({
              ...state,
              socialLinks: {
                ...state.socialLinks,
                loading: false,
              },
            }));
            customAlert('error', MESSAGES.ERROR, response?.data?.message);
          }
        }
      } catch (error) {
        set((state) => ({
            socialLinks: {
              ...state.socialLinks,
              loading: false,
              responseMsg: error.response.data.message,
            },
          }));
          customAlert('error', MESSAGES.ERROR, error.response.data.message);   
      }
    }
  });
  
  export default createSocialSlice;