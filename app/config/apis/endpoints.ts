const Endpoint: (prefix: string) => (endpoint: string) => string =
  (prefix) => (endpoint) =>
    prefix + endpoint;

const UserEndpoint = Endpoint('/v1/user');

export { UserEndpoint };
