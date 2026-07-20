# GoRest API Cypress

Automação de testes de API com Cypress para a API pública do [GoRest](https://gorest.co.in/), desenvolvida como resposta ao desafio técnico de QA.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (LTS recomendado)
- npm
- Token Bearer válido do GoRest ([como obter](https://gorest.co.in/docs/bearer-tokens))

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Configure o token:

```bash
cp .env.example .env
```

Edite `.env` com seu token:

```
GOREST_TOKEN=seu_token_aqui
```

> O arquivo `.env` é local e **não** vai para o Git. O `.env.example` serve apenas como template para quem clonar o repositório.

3. Execute os testes:

```bash
npm run test:api
```

### Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run test:api` | Executa a suíte em modo headless |
| `npm run test:api:headed` | Executa com browser visível |
| `npm run test:api:report` | Executa e salva o log em `docs/test-execution.log` |

## Estratégia dos cenários

Cada item do desafio foi mapeado em um teste `it(...)` independente, com validações reutilizáveis e dados gerados dinamicamente (`UserFactory`) para evitar dependência de registros fixos na API compartilhada.

| # | Cenário do desafio | Teste | Estratégia |
|---|---|---|---|
| 1 | Autenticação válida e consulta | `deve listar usuários e validar schema mínimo` | `GET /users` com Bearer token + schema mínimo |
| 2 | Autenticação inválida | `deve retornar 401 ao usar token inválido` | Token inválido → expectativa de `401` |
| 3 | Criação com dados dinâmicos | `deve criar um usuário com dados válidos` | `UserFactory.build()` + `POST /users` → `201` |
| 4 | Consulta e atualização parcial | `deve consultar e atualizar parcialmente um usuário criado` | Cria usuário próprio → `GET /users/:id` → `PATCH` |
| 5 | Paginação e filtros | `deve paginar e filtrar usuários` | Cria usuário com atributos conhecidos e localiza via filtro `gender` + `status` + `email`; valida páginas distintas |
| 6 | Encadeamento de chamadas | `deve realizar fluxo encadeado: criar, consultar e remover usuário` | `POST` → `GET` → `DELETE` |
| 7 | Remoção e validação pós-exclusão | `deve remover usuário e validar que o recurso não existe mais` | `POST` → `DELETE` → `GET` confirmando `404` |
| 8 | Dois cenários livres | `deve validar o schema completo...` / `deve retornar 404 ao tentar deletar...` | Schema completo após criação; delete de ID inexistente |

### Decisões de implementação

- **`cy.apiRequest`** — comando customizado que centraliza autenticação, `baseUrl` e `failOnStatusCode: false` (requisito do desafio para chamadas recorrentes)
- **`UserService`** — delega todas as requisições HTTP ao comando customizado
- **`UserValidator`** — assertions reutilizáveis com mensagens descritivas
- **`UserFactory`** — gera emails únicos via timestamp
- **Dados próprios** — cenários de alteração, exclusão e filtro criam o usuário antes de manipulá-lo, evitando dependência de dados pré-existentes na sandbox compartilhada
- **Configuração** — `baseUrl`, retries, timeouts e token via `cypress.config.js` + dotenv

## Estrutura do projeto

```
cypress/
├── api/
│   ├── routes/userRoutes.js        # paths dos endpoints
│   ├── services/userService.js     # camada de serviço HTTP
│   └── validators/userValidator.js # validações reutilizáveis
├── e2e/api/goRest.cy.js            # suíte principal (9 testes)
└── support/
    ├── commands.js                 # cy.apiRequest, cy.expectJsonSchema
    ├── userFactory.js              # geração dinâmica de payloads
    ├── index.js                    # registro das abstrações Cypress.*
    └── e2e.js                      # bootstrap do support
cypress.config.js                   # baseUrl, dotenv, retries, vídeo
.env.example                        # template do token (versionado)
docs/test-execution.log             # evidência da execução
```

## Evidências de execução

Última execução registrada: **9 testes passando** em ~9 segundos.

Para gerar ou atualizar a evidência:

```bash
npm run test:api:report
```

- Log completo: `docs/test-execution.log`
- Vídeo da execução: `cypress/videos/goRest.cy.js.mp4` (gerado localmente, ignorado pelo Git)

## Referências

- [GoRest API](https://gorest.co.in/)
- [Documentação GoRest](https://gorest.co.in/docs)
- [Bearer Token](https://gorest.co.in/docs/bearer-tokens)
