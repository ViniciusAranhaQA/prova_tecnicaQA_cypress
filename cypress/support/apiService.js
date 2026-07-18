class GoRestApiService {
  constructor() {
    this.baseUrl = 'https://gorest.co.in/public/v2';
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

  request(method, path, options = {}) {
    return cy.request({
      method,
      url: `${this.baseUrl}${path}`,
      headers: this.getAuthHeaders(options.headers),
      failOnStatusCode: false,
      ...options,
      headers: this.getAuthHeaders(options.headers),
    });
  }

  getUsers(query = '') {
    return this.request('GET', `/users${query}`);
  }

  getUserById(id) {
    return this.request('GET', `/users/${id}`);
  }

  createUser(payload) {
    return this.request('POST', '/users', { body: payload });
  }

  updateUser(id, payload) {
    return this.request('PATCH', `/users/${id}`, { body: payload });
  }

  deleteUser(id) {
    return this.request('DELETE', `/users/${id}`);
  }
}

export default GoRestApiService;
