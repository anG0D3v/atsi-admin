import Api from '@/config/apis';
import axiosInstance from '@/config/axios/axiosInstance';

const ProductsServices = {
  fetchAll: async (data: any) =>
    await axiosInstance.get(
      Api.PRODUCTS().ALL +
        `?price=${data?.price ?? ''}&brandId=${
          data?.brandId ?? ''
        }&categoryId=${data?.categoryId ?? ''}&name=${data?.name}&status=${
          data?.status ?? ''
        }`,
    ),
  fetchProductInfoById: async (id: string) =>
    await axiosInstance.get(Api.PRODUCTS().PRODUCT_INFO_BY_ID + id),
  addProduct: async (data: any) =>
    await axiosInstance.post(Api.PRODUCTS().ADD_PRODUCT, data),
  updateProduct: async (data: any) =>
    await axiosInstance.put(
      Api.PRODUCTS().UPDATE_PRODUCT + `/${data?.id}`,
      data,
    ),
};

export default ProductsServices;
