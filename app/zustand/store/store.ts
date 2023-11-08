import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { createUserSlice, createBrandSlice } from '../slices';
import { type BrandsSlice } from '../slices/brands';
import { type UserSlice } from '../slices/user';

// const log = (config: any) => (set: any, get: any, api: any) =>
//   config(
//     (...args: any) => {
//       console.log('  applying', get());
//       set(...args);

//       console.log('  new state', get());
//     },
//     get,
//     api,
//   );

type AppSlices = UserSlice & BrandsSlice;
const useStore = create<AppSlices>()(
  devtools(
    persist(
      (...args) => ({
        ...createUserSlice(...args),
        ...createBrandSlice(...args),
      }),
      {
        name: 'atsi',
      },
    ),
  ),
);

export default useStore;
