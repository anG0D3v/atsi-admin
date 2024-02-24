import Api from '@/config/apis';
import axiosInstance from '@/config/axios/axiosInstance';

const BrandServices = {
  fetchAll: async (data: any) =>
    await axiosInstance.get(
      Api.BRAND().ALL + `?name=${data?.name}&status=${data?.status}&isDeleted=${data?.isDeleted || false}`,
    ),
  addBrand: async (data: any) =>
    await axiosInstance.post(Api.BRAND().ADD_BRAND, data),
  updateBrand: async (data: any) =>
    await axiosInstance.put(
      Api.BRAND().UPDATE_BRAND + `/${data?.get('id')}`,
      data,
    ),
  deleteBrand: async (data: any) =>
    await axiosInstance.delete(
      Api.BRAND().DELETE_BRAND,
      { data },
    ),
  restoreBrand: async(data:any) =>
  await axiosInstance.put(
    Api.BRAND().RESTORE_BRAND,
    data
  )
};

export default BrandServices;
