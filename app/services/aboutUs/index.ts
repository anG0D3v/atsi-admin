import Api from '@/config/apis';
import axiosInstance from '@/config/axios/axiosInstance';

const AboutUsServices = {
    fetchAll: async(data?:any) =>{
        return(
            await axiosInstance.get(Api.ABOUTUS().ALL + `${data?.productName ? `?status=${data?.status}` : ''}${data?.isDeleted ? `?isDeleted=${data?.isDeleted}` : ''}`)
        )
    },
    addAboutUs: async(data:any) =>
        await axiosInstance.post(
            Api.ABOUTUS().ADD_ABOUTUS,
            data,
        ),
    deleteAboutUs: async (data: any) =>
        await axiosInstance.delete(
        Api.ABOUTUS().DELETE_ABOUTUS,
        { data },
        ),
    updateAboutUs: async (data: any) =>
        await axiosInstance.put(
        Api.ABOUTUS().UPDATE_ABOUTUS + `/${data?.get('id')}`,
        data,
        ),
    restoreAboutUs: async(data:any) =>
    await axiosInstance.put(
        Api.ABOUTUS().RESTORE_ABOUTUS,
        data
    ),
    setActiveAbouts:async(data:any) =>
        await axiosInstance.put(
            Api.ABOUTUS().ACTIVEABOUTS + `/${data?.get('id')}` ,
            data
        ),
    setInActiveAbouts:async(data:any) =>
        await axiosInstance.put(
            Api.ABOUTUS().INACTIVEABOUTS + `/${data?.get('id')}` ,
            data
        ),
}

export default AboutUsServices