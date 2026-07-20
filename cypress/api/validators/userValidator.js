class UserValidator {
  static validateList(response) {
    expect(response.status, 'status HTTP da listagem').to.eq(200);
    expect(response.body, 'body da listagem').to.be.an('array');
    expect(response.body.length, 'quantidade de usuários retornados').to.be.greaterThan(0);

    const firstUser = response.body[0];
    expect(firstUser, 'primeiro usuário da lista').to.be.an('object');
    expect(firstUser).to.include.keys('id', 'name', 'email');
    expect(firstUser.id, 'id do usuário').to.be.a('number');
    expect(firstUser.name, 'nome do usuário').to.be.a('string').and.to.not.be.empty;
    expect(firstUser.email, 'email do usuário').to.be.a('string').and.to.include('@');
  }

  static validateCreated(response, payload) {
    expect(response.status, 'status HTTP da criação').to.eq(201);
    expect(response.body, 'body da criação').to.be.an('object');
    expect(response.body.id, 'id do usuário criado').to.be.a('number');
    expect(response.body.name, 'nome retornado').to.eq(payload.name);
    expect(response.body.email, 'email retornado').to.eq(payload.email);
    expect(response.body.gender, 'gênero retornado').to.eq(payload.gender);
    expect(response.body.status, 'status retornado').to.eq(payload.status);
  }

  static validateUpdated(response, payload) {
    expect(response.status, 'status HTTP da atualização').to.eq(200);
    expect(response.body, 'body da atualização').to.be.an('object');
    expect(response.body).to.include.keys('id', 'name', 'email', 'status');
    expect(response.body.name, 'nome após atualização').to.eq(payload.name);
    expect(response.body.status, 'status após atualização').to.eq(payload.status);
  }

  static validateDeleted(response) {
    expect(response.status, 'status HTTP da exclusão').to.eq(204);
    expect(response.body, 'body da exclusão').to.satisfy((body) => {
      return body === undefined || body === null || body === '' || (typeof body === 'object' && Object.keys(body).length === 0);
    });
  }

  static validateNotFound(response) {
    expect(response.status, 'status HTTP de recurso inexistente').to.eq(404);
    expect(response.body, 'body do erro 404').to.be.an('object');
  }

  static validateUnauthorized(response) {
    expect(response.status, 'status HTTP de autenticação inválida').to.eq(401);
    expect(response.body, 'body do erro 401').to.be.an('object');
  }

  static validateSchema(user) {
    expect(user, 'usuário retornado').to.include.keys('id', 'name', 'email');
    expect(user.id, 'id no schema').to.be.a('number');
    expect(user.name, 'nome no schema').to.be.a('string').and.to.not.be.empty;
    expect(user.email, 'email no schema').to.be.a('string').and.to.include('@');
  }

  static validateFullSchema(user) {
    expect(user, 'usuário retornado').to.include.keys('id', 'name', 'email', 'gender', 'status');
    expect(user.id, 'id no schema completo').to.be.a('number');
    expect(user.name, 'nome no schema completo').to.be.a('string').and.to.not.be.empty;
    expect(user.email, 'email no schema completo').to.be.a('string').and.to.include('@');
    expect(user.gender, 'gênero no schema completo').to.be.oneOf(['male', 'female']);
    expect(user.status, 'status no schema completo').to.be.oneOf(['active', 'inactive']);
  }

  static validateFilteredUsers(response, filters) {
    expect(response.status, 'status HTTP da listagem filtrada').to.eq(200);
    expect(response.body, 'body da listagem filtrada').to.be.an('array');
    expect(response.body.length, 'quantidade de usuários filtrados').to.be.greaterThan(0);

    response.body.forEach((user, index) => {
      if (filters.gender) {
        expect(user.gender, `gênero do usuário ${index}`).to.eq(filters.gender);
      }
      if (filters.status) {
        expect(user.status, `status do usuário ${index}`).to.eq(filters.status);
      }
    });
  }
}

export default UserValidator;
