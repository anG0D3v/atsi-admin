import Api from '@/config/apis';
import axiosInstance from '@/config/axios/axiosInstance';

const UserListSevices = {
    fetchAll: async (data:any) =>
    await axiosInstance.get(
        Api.USER().USER_LIST + `?username=${data?.username}&status=${data?.status}&type=${data?.type}&isDeleted=${data?.isDeleted || false}`
    ),
    deleteUser: async (data: any) => 
     await axiosInstance.delete(Api.USER().DELETE_USER, {data})
    ,
    addUser: async (data:any) =>
    await axiosInstance.post(Api.USER().ADD_USER, data),
    updateUser: async (data:any) =>
    await axiosInstance.put(Api.USER().UPDATE_USER + `/${data?.id}`, data),
    restoreUser: async(data:any) =>
    await axiosInstance.put(Api.USER().RESTORE_USER,data)
}

export default UserListSevices;