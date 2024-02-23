import Api from '@/config/apis';
import axiosInstance from '@/config/axios/axiosInstance';

const WebServices = {
    fetchAll: async(data:any) =>
    await axiosInstance.get(Api.WEB().ALL),
    addBlogs: async (data: any) =>
    await axiosInstance.post(Api.WEB().ADD_BLOGS, data),
    updateBlogs: async (data: any) =>
        await axiosInstance.put(
        Api.WEB().UPDATE_BLOGS + `/${data?.get('id')}`,
        data,
        ),
    deleteBlogs: async (data: any) =>
        await axiosInstance.delete(
        Api.WEB().DELETE_BLOGS,
        { data },
        ),
    restoreBlogs: async(data:any) =>
    await axiosInstance.put(
        Api.WEB().RESTORE_BLOGS,
        data
    )
}

export default WebServices