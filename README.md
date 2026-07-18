# GoRest API Cypress

Este projeto usa Cypress para automação de testes de API contra a API pública do GoRest.

## Estratégia dos cenários

A suíte foi organizada para mapear os cenários pedidos em testes independentes do Cypress, com validações claras e comentários de contexto junto a cada caso.

Os cenários cobrem:
- autenticação válida e consulta de usuários
- cenário de erro com autenticação inválida
- criação de usuário com dados dinâmicos
- consulta e atualização parcial
- paginação e filtros
- encadeamento de chamadas entre criação, consulta e remoção
- remoção e validação pós-exclusão
- dois cenários livres com dados dinâmicos

### Como garantir que todos os cenários executem
- Cada cenário está implementado como um teste `it(...)` separado.
- O arquivo principal exibe no relatório do Cypress cada caso executado.
- Se algum cenário não rodar, ele aparecerá como ausente ou com falha no resumo final.
- O uso de `Cypress.UserValidator` e `Cypress.UserFactory` mantém a execução consistente e reutilizável.

## Estrutura

- cypress/e2e/api/goRest.cy.js: suíte principal com os cenários de API
- cypress/api/routes/userRoutes.js: centraliza os endpoints da API
- cypress/api/services/userService.js: camada de serviço responsável pelas requisições HTTP
- cypress/api/validators/userValidator.js: validações reutilizáveis dos cenários
- cypress/support/commands.js: comandos customizados do Cypress
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
