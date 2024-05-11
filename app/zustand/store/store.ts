import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import {
  createUserSlice,
  createBrandSlice,
  createCategoriesSlice,
  createProductsSlice,
  createUserListSlice,
  createWebSlice,
  createAboutSlice,
  createLandingSlice,
  createSocialSlice
} from '../slices';
import { type AboutSlice } from '../slices/aboutus';
import { type BrandsSlice } from '../slices/brands';
import { type CategoriesSlice } from '../slices/categories';
import { type LandingSlice } from '../slices/landingPage';
import { type ProductsSlice } from '../slices/products';
import { type SocialSlice } from '../slices/socialMedia';
import { type UserSlice } from '../slices/user';
import { type UserListSlice} from '../slices/userlist';
import { type WebSlice } from '../slices/web'

type TAppSlices = UserSlice & BrandsSlice & CategoriesSlice & ProductsSlice & UserListSlice & WebSlice & AboutSlice & LandingSlice & SocialSlice;
const useStore = create<TAppSlices>()(
  devtools(
    persist(
      (...args) => ({
        ...createUserSlice(...args),
        ...createBrandSlice(...args),
        ...createCategoriesSlice(...args),
        ...createProductsSlice(...args),
        ...createUserListSlice(...args),
        ...createWebSlice(...args),
        ...createAboutSlice(...args),
        ...createLandingSlice(...args),
        ...createSocialSlice(...args)
      }),
      {
        name: 'atsi',
      },
    ),
  ),
);

export default useStore;
