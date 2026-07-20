import UserRoutes from '../routes/userRoutes';

class UserService {
  request(method, path, options = {}) {
    return cy.apiRequest(method, path, options);
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
