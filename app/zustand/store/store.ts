import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import {
  createUserSlice,
  createBrandSlice,
  createCategoriesSlice,
  createProductsSlice,
  createUserListSlice,
  createWebSlice
} from '../slices';
import { type BrandsSlice } from '../slices/brands';
import { type CategoriesSlice } from '../slices/categories';
import { type ProductsSlice } from '../slices/products';
import { type UserSlice } from '../slices/user';
import { type UserListSlice} from '../slices/userlist';
import { type WebSlice } from '../slices/web'

type TAppSlices = UserSlice & BrandsSlice & CategoriesSlice & ProductsSlice & UserListSlice & WebSlice;
const useStore = create<TAppSlices>()(
  devtools(
    persist(
      (...args) => ({
        ...createUserSlice(...args),
        ...createBrandSlice(...args),
        ...createCategoriesSlice(...args),
        ...createProductsSlice(...args),
        ...createUserListSlice(...args),
        ...createWebSlice(...args)
      }),
      {
        name: 'atsi',
      },
    ),
  ),
);

export default useStore;
