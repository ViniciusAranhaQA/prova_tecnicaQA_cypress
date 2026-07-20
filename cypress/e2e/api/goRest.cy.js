describe('GoRest API - Cenários técnicos', () => {
  const apiService = new Cypress.UserService();

  // Cenário 1: Autenticação válida e consulta de usuários — faz uma requisição GET para listar usuários e valida se a resposta contém dados válidos e o schema mínimo esperado.
  it('deve listar usuários e validar schema mínimo', () => {
    apiService.getUsers('?page=1&per_page=1').then((response) => {
      Cypress.UserValidator.validateList(response);
      const user = response.body[0];
      Cypress.UserValidator.validateSchema(user);
    });
  });

  // Cenário 2: Erro de autenticação inválida — envia uma requisição com token inválido para garantir que a API retorne erro 401.
  it('deve retornar 401 ao usar token inválido', () => {
    apiService.getUsersWithInvalidToken().then((response) => {
      Cypress.UserValidator.validateUnauthorized(response);
    });
  });

  // Cenário 3: Criação de usuário com dados dinâmicos — gera um payload com dados automáticos e verifica se a API cria o usuário corretamente com status 201.
  it('deve criar um usuário com dados válidos', () => {
    const payload = Cypress.UserFactory.build();

    apiService.createUser(payload).then((response) => {
      Cypress.UserValidator.validateCreated(response, payload);
    });
  });

  // Cenário 4: Consulta e atualização parcial — cria um usuário próprio, consulta o recurso e aplica PATCH parcial sem depender de dados externos.
  it('deve consultar e atualizar parcialmente um usuário criado', () => {
    const payload = Cypress.UserFactory.build();
    const updatePayload = {
      name: `Updated User ${Date.now()}`,
      status: 'inactive',
    };

    apiService.createUser(payload).then((createResponse) => {
      const userId = createResponse.body.id;
      Cypress.UserValidator.validateCreated(createResponse, payload);

      apiService.getUserById(userId).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.id).to.eq(userId);
        expect(getResponse.body.name).to.eq(payload.name);

        apiService.updateUser(userId, updatePayload).then((response) => {
          Cypress.UserValidator.validateUpdated(response, updatePayload);
        });
      });
    });
  });

  // Cenário 5: Paginação e filtros — cria um usuário com atributos conhecidos e o localiza via filtro, sem depender de dados pré-existentes na sandbox.
  it('deve paginar e filtrar usuários', () => {
    const payload = Cypress.UserFactory.build({ gender: 'female', status: 'active' });

    apiService.createUser(payload).then((createResponse) => {
      Cypress.UserValidator.validateCreated(createResponse, payload);

      apiService.getUsers(`?gender=female&status=active&email=${payload.email}`).then((filtered) => {
        Cypress.UserValidator.validateFilteredUsers(filtered, { gender: 'female', status: 'active' });
        expect(filtered.body.some((user) => user.email === payload.email), 'usuário criado presente no filtro').to.be.true;
      });
    });

    apiService.getUsers('?page=1&per_page=2').then((pageOne) => {
      expect(pageOne.status).to.eq(200);
      expect(pageOne.body).to.have.length(2);

      apiService.getUsers('?page=2&per_page=2').then((pageTwo) => {
        expect(pageTwo.status).to.eq(200);
        expect(pageTwo.body).to.have.length(2);
        expect(pageTwo.body[0].id).to.not.eq(pageOne.body[0].id);
        pageTwo.body.forEach((user) => {
          expect(user).to.include.keys('id', 'name', 'email');
        });
      });
    });
  });

  // Cenário 6: Encadeamento de chamadas — cria um usuário, consulta o mesmo recurso e remove, validando cada etapa do fluxo.
  it('deve realizar fluxo encadeado: criar, consultar e remover usuário', () => {
    const payload = Cypress.UserFactory.build({ gender: 'female' });

    apiService.createUser(payload).then((createResponse) => {
      const userId = createResponse.body.id;
      Cypress.UserValidator.validateCreated(createResponse, payload);

      apiService.getUserById(userId).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.id).to.eq(userId);
        expect(getResponse.body.name).to.eq(payload.name);
        expect(getResponse.body.email).to.eq(payload.email);

        apiService.deleteUser(userId).then((deleteResponse) => {
          Cypress.UserValidator.validateDeleted(deleteResponse);
        });
      });
    });
  });

  // Cenário 7: Remoção e validação pós-exclusão — remove um usuário criado e confirma que a consulta subsequente retorna 404.
  it('deve remover usuário e validar que o recurso não existe mais', () => {
    const payload = Cypress.UserFactory.build();

    apiService.createUser(payload).then((createResponse) => {
      const userId = createResponse.body.id;
      Cypress.UserValidator.validateCreated(createResponse, payload);

      apiService.deleteUser(userId).then((deleteResponse) => {
        Cypress.UserValidator.validateDeleted(deleteResponse);

        apiService.getUserById(userId).then((afterDelete) => {
          Cypress.UserValidator.validateNotFound(afterDelete);
        });
      });
    });
  });

  // Cenário 8 — livre 1: valida o schema completo do usuário retornado após a criação dinâmica.
  it('deve validar o schema completo de um usuário recém-criado', () => {
    const payload = Cypress.UserFactory.build({ gender: 'female', status: 'active' });

    apiService.createUser(payload).then((response) => {
      Cypress.UserValidator.validateCreated(response, payload);
      cy.expectJsonSchema(response.body);
    });
  });

  // Cenário 8 — livre 2: valida erro 404 ao tentar deletar um usuário que não existe.
  it('deve retornar 404 ao tentar deletar usuário inexistente', () => {
    apiService.deleteUser(999999999).then((response) => {
      Cypress.UserValidator.validateNotFound(response);
    });
  });
});
