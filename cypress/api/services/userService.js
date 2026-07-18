import UserRoutes from '../routes/userRoutes';

class UserService {
  constructor() {
    this.authToken = Cypress.config('gorestToken') || process.env.GOREST_TOKEN || process.env.gorestToken || process.env.CYPRESS_gorestToken || '';
  }

  getAuthHeaders(extraHeaders = {}) {
    const headers = {
      Accept: 'application/json',
      ...extraHeaders,
    };

    if (!headers.Authorization && this.authToken && this.authToken !== 'YOUR_TOKEN_HERE') {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  request(method, url, options = {}) {
    return cy.request({
      method,
      url,
      headers: this.getAuthHeaders(options.headers),
      failOnStatusCode: false,
      ...options,
      headers: this.getAuthHeaders(options.headers),
    });
  }

  getUsers(query = '') {
    return this.request('GET', `${UserRoutes.users()}${query}`);
  }

  getUserById(id) {
    return this.request('GET', UserRoutes.userById(id));
  }

  getUsersWithInvalidToken() {
    return this.request('GET', UserRoutes.users(), {
      headers: { Authorization: 'Bearer token_invalido' },
    });
  }

  createUser(payload) {
    return this.request('POST', UserRoutes.users(), { body: payload });
  }

  updateUser(id, payload) {
    return this.request('PATCH', UserRoutes.userById(id), { body: payload });
  }

  deleteUser(id) {
    return this.request('DELETE', UserRoutes.userById(id));
  }
}

export default UserService;
