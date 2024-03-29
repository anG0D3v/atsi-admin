import { ApiEndpoint } from './endpoints';

const Api = {
  USER: (base = '/user') => ({
    LOGIN: ApiEndpoint(base + '/login'),
    GET_BY_EMAIL: ApiEndpoint(base + '/findByEmail'),
    USER_LIST: ApiEndpoint(base + '/fetch'),
    DELETE_USER: ApiEndpoint(base + '/delete'),
    ADD_USER: ApiEndpoint(base + '/add'),
    UPDATE_USER: ApiEndpoint(base + '/update'),
    RESTORE_USER: ApiEndpoint(base + '/restore')
  }),

  BRAND: (base = '/brands') => ({
    ALL: ApiEndpoint(base + '/all'),
    ADD_BRAND: ApiEndpoint(base + '/add'),
    UPDATE_BRAND: ApiEndpoint(base + '/update'),
    DELETE_BRAND: ApiEndpoint(base + '/delete'),
    RESTORE_BRAND: ApiEndpoint(base + '/restore')
  }),

  CATEGORIES: (base = '/categories') => ({
    ALL: ApiEndpoint(base + '/all'),
    ADD_CATEGORY: ApiEndpoint(base + '/add'),
    UPDATE_CATEGORY: ApiEndpoint(base + '/update'),
    DELETE_CATEGORY: ApiEndpoint(base + '/delete'),
    RESTORE_CATEGORY: ApiEndpoint(base + '/restore')
  }),

  PRODUCTS: (base = '/products') => ({
    ALL: ApiEndpoint(base + '/all'),
    PRODUCT_INFO_BY_ID: ApiEndpoint(base + '/info/'),
    ADD_PRODUCT: ApiEndpoint(base + '/add'),
    UPDATE_PRODUCT: ApiEndpoint(base + '/update'),
    DELETE_IMAGES: ApiEndpoint(base + '/delete/images'),
    DELETE_PRODUCTS: ApiEndpoint(base + '/delete'),
    RESTORE_PRODUCTS: ApiEndpoint(base + '/restore')
  }),

  WEB: (base = '/blogs') => ({
    ALL: ApiEndpoint(base + '/all'),
    ADD_BLOGS: ApiEndpoint(base + '/add'),
    BLOG_INFO_BY_ID: ApiEndpoint(base + '/info/'),
    UPDATE_BLOGS: ApiEndpoint(base + '/update'),
    DELETE_BLOGS: ApiEndpoint(base + '/delete'),
    RESTORE_BLOGS: ApiEndpoint(base + '/restore')
  }),

  FEEDBACK: (base = '/feedbacks') => ({
    ALL: ApiEndpoint(base + '/all'),
    DELETE_FEEDBACK: ApiEndpoint(base + '/delete'),
    RESTORE_FEEDBACK: ApiEndpoint(base + '/restore')
  })

};

export default Api;
