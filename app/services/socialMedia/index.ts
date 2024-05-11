import Api from '@/config/apis';
import axiosInstance from '@/config/axios/axiosInstance';

const SocialMediaServices = {
    fetchAll: async(data?:any) =>{
        return(
            await axiosInstance.get(Api.SOCIALMEDIA().ALL + `${data?.status ? `?status=${data?.status}` : ''}${data?.isDeleted ? `?isDeleted=${data?.isDeleted}` : ''}`)
        )
    },
    addSocialMedia: async(data:any) =>
        await axiosInstance.post(
            Api.SOCIALMEDIA().ADD_SOCIALMEDIA,
            data,
        ),
    deleteSocialMedia: async (data: any) =>
        await axiosInstance.delete(
        Api.SOCIALMEDIA().DELETE_SOCIALMEDIA,
        { data },
        ),
    updateSocialMedia: async (data: any) =>
        await axiosInstance.put(
        Api.SOCIALMEDIA().UPDATE_SOCIALMEDIA + `/${data?.get('id')}`,
        data,
        ),
    restoreSocialMedia: async(data:any) =>
    await axiosInstance.put(
        Api.SOCIALMEDIA().RESTORE_SOCIALMEDIA,
        data
    ),
    setActiveSocialMedia:async(data:any) =>
        await axiosInstance.put(
            Api.SOCIALMEDIA().ACTIVESOCIALMEDIA + `/${data?.get('id')}` ,
            data
        ),
    setInActiveSocialMedia:async(data:any) =>
        await axiosInstance.put(
            Api.SOCIALMEDIA().INACTIVESOCIALMEDIA + `/${data?.get('id')}` ,
            data
        ),
}

export default SocialMediaServices