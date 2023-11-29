import { ApiEndpoint } from './endpoints';

const Api = {
  USER: (base = '/user') => ({
    LOGIN: ApiEndpoint(base + '/login'),
    GET_BY_EMAIL: ApiEndpoint(base + '/findByEmail'),
  }),

  BRAND: (base = '/brands') => ({
    ALL: ApiEndpoint(base + '/all'),
    ADD_BRAND: ApiEndpoint(base + '/add'),
    UPDATE_BRAND: ApiEndpoint(base + '/update'),
    DELETE_BRAND: ApiEndpoint(base + '/delete'),
  }),

  CATEGORIES: (base = '/categories') => ({
    ALL: ApiEndpoint(base + '/all'),
    ADD_CATEGORY: ApiEndpoint(base + '/add'),
    UPDATE_CATEGORY: ApiEndpoint(base + '/update'),
    DELETE_CATEGORY: ApiEndpoint(base + '/delete'),
  }),
};

export default Api;
