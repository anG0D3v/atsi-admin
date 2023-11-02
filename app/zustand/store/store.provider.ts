import useStore from './store';
const selector = (key: string) => (state: any) => state[key];
const storeProvider = useStore.getState();
export const { login, getUserByEmail, saveUserInfo } = storeProvider;

export { selector, storeProvider };
