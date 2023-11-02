import { UserEndpoint } from './endpoints';

const Api = {
  USER: (base = '') => ({
    LOGIN: UserEndpoint('/login'),
    GET_BY_EMAIL: UserEndpoint('/findByEmail'),
  }),
};

export default Api;
