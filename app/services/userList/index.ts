import Api from '@/config/apis';
import axiosInstance from '@/config/axios/axiosInstance';

const UserListSevices = {
    fetchAll: async (data:any) =>
    await axiosInstance.get(
        Api.USER().USER_LIST + `?username=${data?.username}&status=${data?.status}&type=${data?.type}`
    ),
    deleteUser: async (data: any) =>
    await axiosInstance.delete(
        Api.USER().DELETE_USER + `/${data.id}`
    )
}

export default UserListSevices;