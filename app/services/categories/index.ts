import Api from '@/config/apis';
import axiosInstance from '@/config/axios/axiosInstance';

const CategoriesServices = {
  fetchAll: async (data?: any) =>
    await axiosInstance.get(
      Api.CATEGORIES().ALL + `?name=${data?.name ? data?.name : ''}&status=${data?.status ? data?.status : ''}`,
    ),
  addCategory: async (data: any) =>
    await axiosInstance.post(Api.CATEGORIES().ADD_CATEGORY, data),
  updateCategory: async (data: any) =>
    await axiosInstance.put(
      Api.CATEGORIES().UPDATE_CATEGORY + `/${data?.get('id')}`,
      data,
    ),
  deleteCategory: async (data: any) =>
    await axiosInstance.delete(
      Api.CATEGORIES().DELETE_CATEGORY,
      { data },
    ),
    restoreCategories: async(data:any) =>
    await axiosInstance.put(
      Api.CATEGORIES().RESTORE_CATEGORY,
      data
    )
};

export default CategoriesServices;
