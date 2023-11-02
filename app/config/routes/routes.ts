const dashboard = (page: string) => '/dashboard' + page;

export const Routes = {
  Dashboard: dashboard(''),
  Brands: dashboard('/brands'),
};
