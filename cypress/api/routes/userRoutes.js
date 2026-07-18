class UserRoutes {
  static baseUrl = 'https://gorest.co.in/public/v2';

  static users() {
    return `${this.baseUrl}/users`;
  }

  static userById(id) {
    return `${this.baseUrl}/users/${id}`;
  }
}

export default UserRoutes;
