import Api from '@/config/apis';
import axiosInstance from '@/config/axios/axiosInstance';

const BrandServices = {
  fetchAll: async () => await axiosInstance.get(Api.BRAND().ALL),
  addBrand: async (data: any) =>
    await axiosInstance.post(Api.BRAND().ADD_BRAND, data),
  updateBrand: async (data: any) =>
    await axiosInstance.put(
      Api.BRAND().UPDATE_BRAND + `/${data?.get('id')}`,
      data,
    ),
  deleteBrand: async (data: any) =>
    await axiosInstance.delete(
      Api.BRAND().DELETE_BRAND + `/${data?.get('id')}`,
      { data },
    ),
};

export default BrandServices;
