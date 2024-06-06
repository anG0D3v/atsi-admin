import Api from '@/config/apis';
import axiosInstance from '@/config/axios/axiosInstance';

const UserServices = {
  login: async (data: any) => await axiosInstance.post(Api.USER().LOGIN, data),
  getUserByEmal: async (data: any) =>
    await axiosInstance.post(Api.USER().GET_BY_EMAIL, data),
  forgotPasswordApi: async (data: any) => await axiosInstance.post(Api.USER().FORGOT_PASSWORD, data),
  resetPasswordApi: async (data: any) => await axiosInstance.put(Api.USER().RESET_PASSWORD, data),
};

export default UserServices;
