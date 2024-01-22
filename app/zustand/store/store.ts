import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import {
  createUserSlice,
  createBrandSlice,
  createCategoriesSlice,
  createProductsSlice,
} from '../slices';
import { type BrandsSlice } from '../slices/brands';
import { type CategoriesSlice } from '../slices/categories';
import { type ProductsSlice } from '../slices/products';
import { type UserSlice } from '../slices/user';

type TAppSlices = UserSlice & BrandsSlice & CategoriesSlice & ProductsSlice;
const useStore = create<TAppSlices>()(
  devtools(
    persist(
      (...args) => ({
        ...createUserSlice(...args),
        ...createBrandSlice(...args),
        ...createCategoriesSlice(...args),
        ...createProductsSlice(...args),
      }),
      {
        name: 'atsi',
      },
    ),
  ),
);

export default useStore;
