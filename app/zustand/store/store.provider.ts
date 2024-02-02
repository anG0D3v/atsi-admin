import useStore from './store';
const selector = (key: string) => (state: any) => state[key];
const storeProvider = useStore.getState();
export const {
  login,
  getUserByEmail,
  saveUserInfo,
  user,
  brands,
  loadBrands,
  addBrand,
  updateBrand,
  deleteBrand,
  categories,
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  products,
  loadProducts,
  addProduct,
  fetchUserList,
  deleteUser,
  addUser,
  updateUser,
  logout,
  updateProduct,
  deleteProductImg
} = storeProvider;

export { selector, storeProvider };
