class UserValidator {
  static validateList(response) {
    expect(response.status).to.eq(200);
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
  }

  static validateCreated(response, payload) {
    expect(response.status).to.eq(201);
    expect(response.body).to.include(payload);
    expect(response.body.id).to.be.a('number');
  }

  static validateUpdated(response, payload) {
    expect(response.status).to.eq(200);
    expect(response.body).to.include(payload);
  }

  static validateDeleted(response) {
    expect(response.status).to.eq(204);
  }

  static validateNotFound(response) {
    expect(response.status).to.eq(404);
  }

  static validateUnauthorized(response) {
    expect(response.status).to.eq(401);
  }

  static validateSchema(user) {
    expect(user).to.include.keys('id', 'name', 'email');
  }
}

export default UserValidator;
