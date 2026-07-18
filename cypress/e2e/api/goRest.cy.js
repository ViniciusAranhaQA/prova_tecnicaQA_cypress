describe('GoRest API - Cenários técnicos', () => {
  const apiService = new Cypress.UserService();

  // Cenário 1: Autenticação válida e consulta de usuários — faz uma requisição GET para listar usuários e valida se a resposta contém dados válidos e o schema mínimo esperado.
  it('deve listar usuários e validar schema mínimo', () => {
    apiService.getUsers('?page=1&per_page=1').then((response) => {
      Cypress.UserValidator.validateList(response);
      const user = response.body[0];
      Cypress.UserValidator.validateSchema(user);
      expect(user.id).to.be.a('number');
      expect(user.name).to.be.a('string');
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

  // Cenário 4: Consulta e atualização parcial — busca um usuário existente e aplica uma atualização parcial para validar se a API aceita a mudança de dados.
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

  // Cenário 5: Paginação e filtros — faz requisições em páginas diferentes para confirmar que a API retorna listas paginadas corretamente.
  it('deve paginar e filtrar usuários', () => {
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

  // Cenário 6: Encadeamento de chamadas — cria um usuário, consulta o mesmo recurso e valida o fluxo sequencial entre operações da API.
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

          apiService.getUserById(userId).then((afterDelete) => {
            Cypress.UserValidator.validateNotFound(afterDelete);
          });
        });
      });
    });
  });

  // Cenário 7: Remoção e validação pós-exclusão — remove um usuário criado e verifica se, após a exclusão, a consulta do recurso retorna erro 404.
  it('deve validar erro ao tentar deletar usuário inexistente', () => {
    apiService.deleteUser(999999999).then((response) => {
      Cypress.UserValidator.validateNotFound(response);
    });
  });

  // Cenário 8: Cenário livre 1 — valida a estrutura do usuário retornado em uma consulta e verifica se o schema básico está correto.
  it('deve preencher o schema esperado para um usuário', () => {
    apiService.getUsers('?page=1&per_page=1').then((response) => {
      Cypress.UserValidator.validateList(response);
      const user = response.body[0];
      cy.expectJsonSchema(user);
    });
  });

  // Cenário 8: Cenário livre 2 — cria um usuário com dados dinâmicos adicionais e valida se as propriedades retornadas correspondem ao payload enviado.
  it('deve aceitar um cenário livre com dados dinâmicos', () => {
    const payload = Cypress.UserFactory.build({ gender: 'female' });

    apiService.createUser(payload).then((response) => {
      Cypress.UserValidator.validateCreated(response, payload);
      expect(response.body.name).to.eq(payload.name);
      expect(response.body.status).to.eq(payload.status);
      expect(response.body.email).to.eq(payload.email);
    });
  });
});
