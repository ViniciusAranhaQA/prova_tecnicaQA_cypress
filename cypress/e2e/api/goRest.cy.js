describe('GoRest API - Cenários técnicos', () => {
  const apiService = new Cypress.UserService();

  it('deve listar usuários e validar schema mínimo', () => {
    apiService.getUsers('?page=1&per_page=1').then((response) => {
      Cypress.UserValidator.validateList(response);
      const user = response.body[0];
      Cypress.UserValidator.validateSchema(user);
    });
  });

  it('deve retornar 401 ao usar token inválido', () => {
    apiService.getUsersWithInvalidToken().then((response) => {
      Cypress.UserValidator.validateUnauthorized(response);
    });
  });

  it('deve criar um usuário com dados válidos', () => {
    const payload = Cypress.UserFactory.build();

    apiService.createUser(payload).then((response) => {
      Cypress.UserValidator.validateCreated(response, payload);
    });
  });

  it('deve atualizar um usuário existente', () => {
    const updatePayload = {
      name: `Updated User ${Date.now()}`,
      status: 'inactive',
    };

    apiService.getUsers('?page=1&per_page=1').then((listResponse) => {
      const userId = listResponse.body[0].id;
      apiService.updateUser(userId, updatePayload).then((response) => {
        Cypress.UserValidator.validateUpdated(response, updatePayload);
      });
    });
  });

  it('deve paginar e filtrar usuários', () => {
    apiService.getUsers('?page=1&per_page=2').then((pageOne) => {
      expect(pageOne.status).to.eq(200);
      expect(pageOne.body).to.have.length(2);

      apiService.getUsers('?page=2&per_page=2').then((pageTwo) => {
        expect(pageTwo.status).to.eq(200);
        expect(pageTwo.body).to.have.length(2);
        expect(pageTwo.body[0].id).to.not.eq(pageOne.body[0].id);
      });
    });
  });

  it('deve realizar fluxo encadeado: criar, consultar e remover usuário', () => {
    const payload = Cypress.UserFactory.build({ gender: 'female' });

    apiService.createUser(payload).then((createResponse) => {
      const userId = createResponse.body.id;
      Cypress.UserValidator.validateCreated(createResponse, payload);

      apiService.getUserById(userId).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.id).to.eq(userId);

        apiService.deleteUser(userId).then((deleteResponse) => {
          Cypress.UserValidator.validateDeleted(deleteResponse);

          apiService.getUserById(userId).then((afterDelete) => {
            Cypress.UserValidator.validateNotFound(afterDelete);
          });
        });
      });
    });
  });

  it('deve validar erro ao tentar deletar usuário inexistente', () => {
    apiService.deleteUser(999999999).then((response) => {
      Cypress.UserValidator.validateNotFound(response);
    });
  });

  it('deve preencher o schema esperado para um usuário', () => {
    apiService.getUsers('?page=1&per_page=1').then((response) => {
      Cypress.UserValidator.validateList(response);
      const user = response.body[0];
      cy.expectJsonSchema(user);
    });
  });

  it('deve aceitar um cenário livre com dados dinâmicos', () => {
    const payload = Cypress.UserFactory.build({ gender: 'female' });

    apiService.createUser(payload).then((response) => {
      Cypress.UserValidator.validateCreated(response, payload);
      expect(response.body.name).to.eq(payload.name);
    });
  });
});
