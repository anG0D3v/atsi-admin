import Api from '@/config/apis';
import axiosInstance from '@/config/axios/axiosInstance';

const UserServices = {
  login: async (data: any) => await axiosInstance.post(Api.USER().LOGIN, data),
  getUserByEmal: async (data: any) =>
    await axiosInstance.post(Api.USER().GET_BY_EMAIL, data),
};

export default UserServices;
