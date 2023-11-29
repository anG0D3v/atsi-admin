import Api from '@/config/apis';
import axiosInstance from '@/config/axios/axiosInstance';

const CategoriesServices = {
  fetchAll: async (data: any) =>
    await axiosInstance.get(
      Api.CATEGORIES().ALL + `?name=${data?.name}&status=${data?.status}`,
    ),
  addCategory: async (data: any) =>
    await axiosInstance.post(Api.CATEGORIES().ADD_CATEGORY, data),
  updateCategory: async (data: any) =>
    await axiosInstance.put(
      Api.CATEGORIES().UPDATE_CATEGORY + `/${data?.id}`,
      data,
    ),
  deleteCategory: async (data: any) =>
    await axiosInstance.delete(
      Api.CATEGORIES().DELETE_CATEGORY + `/${data?.id}`,
      { data },
    ),
};

export default CategoriesServices;
