class UserRoutes {
  static users() {
    return '/users';
  }

  static userById(id) {
    return `/users/${id}`;
  }
}

export default UserRoutes;
