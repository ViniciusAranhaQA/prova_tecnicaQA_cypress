# GoRest API Cypress

Este projeto usa Cypress para automação de testes de API contra a API pública do GoRest.

## Estratégia dos cenários

Os testes cobrem:
- leitura pública de usuários
- autenticação/erro 401 com token inválido
- criação de usuário
- atualização de usuário
- paginação e filtragem
- fluxo encadeado de criação, consulta e remoção
- validação de erro em delete de recurso inexistente
- validação de schema mínimo
- cenário livre com dados dinâmicos

## Estrutura

- cypress/e2e/api/goRest.cy.js: suíte principal com os cenários de API
- cypress/support/commands.js: comandos customizados do Cypress
- cypress/support/apiService.js: camada de serviço orientada a objetos para encapsular as requisições ao GoRest
- cypress/support/userFactory.js: factory para criar payloads de usuários de forma reutilizável
- cypress/support/index.js: registro das abstrações no ambiente do Cypress
- cypress.config.js: configuração do Cypress com dotenv

## Como executar

1. Instale as dependências:
   npm install
2. Crie um arquivo .env com o token do GoRest. O projeto aceita tanto `GOREST_TOKEN` quanto `gorestToken`:
   GOREST_TOKEN=seu_token_aqui
   # ou
   gorestToken=seu_token_aqui
3. Execute os testes:
   npm run test:api

## Observações

- O token é mantido localmente em .env e está ignorado pelo Git.
- O projeto usa dotenv para carregar esse valor e repassar o token para os requests de API.
- O arquivo .env deve conter pelo menos uma das opções abaixo:
  - GOREST_TOKEN=seu_token_aqui
  - ou gorestToken=seu_token_aqui
