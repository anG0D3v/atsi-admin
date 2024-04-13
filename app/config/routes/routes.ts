const dashboard = (page: string) => '/dashboard' + page;

export const Routes = {
  Dashboard: dashboard(''),
  Brands: dashboard('/brands'),
  Categories: dashboard('/categories'),
  Products: dashboard('/products'),
  Users: dashboard('/users'),
  Web:dashboard('/web'),
  Feedback:dashboard('/feedback'),
  AboutUS:dashboard('/aboutUs'),
  LandingPage:dashboard('/landingPage'),
  Login: ('/')
};
