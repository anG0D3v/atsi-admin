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
        }&isDeleted=${data?.isDeleted || false}`,
    ),
  fetchProductInfoById: async (id: string) =>
    await axiosInstance.get(Api.PRODUCTS().PRODUCT_INFO_BY_ID + id),
  addProduct: async (data: any) =>
    await axiosInstance.post(Api.PRODUCTS().ADD_PRODUCT, data),
  updateProduct: async (data: any) =>
    await axiosInstance.put(
      Api.PRODUCTS().UPDATE_PRODUCT + `/${data?.get('id')}`,
      data,
    ),
    deleteProductImg: async (data: any) => 
     await axiosInstance.delete(
        Api.PRODUCTS().DELETE_IMAGES + `/${data?.get('id')}`,
        {data}
      ),
    deleteProduct: async(data:any) =>
    await axiosInstance.delete(
      Api.PRODUCTS().DELETE_PRODUCTS,{data}
    ),
    restoreProduct: async(data:any) =>
    await axiosInstance.put(Api.PRODUCTS().RESTORE_PRODUCTS,data)
};

export default ProductsServices;
