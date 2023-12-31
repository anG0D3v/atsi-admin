const dashboard = (page: string) => '/dashboard' + page;

export const Routes = {
  Dashboard: dashboard(''),
  Brands: dashboard('/brands'),
  Categories: dashboard('/categories'),
  Products: dashboard('/products'),
  Users: dashboard('/users'),
};
