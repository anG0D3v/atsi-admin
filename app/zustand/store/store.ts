import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { createUserSlice } from '../slices';
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
const useStore = create<UserSlice>()(
  devtools(
    persist((...args) => ({ ...createUserSlice(...args) }), {
      name: 'atsi',
    }),
  ),
);

export default useStore;
