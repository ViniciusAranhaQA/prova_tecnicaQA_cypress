Cypress.Commands.add('apiRequest', (method, path, options = {}) => {
  const authToken = Cypress.config('gorestToken') || '';

  const requestHeaders = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (!requestHeaders.Authorization && authToken && authToken !== 'YOUR_TOKEN_HERE') {
    requestHeaders.Authorization = `Bearer ${authToken}`;
  }

  return cy.request({
    failOnStatusCode: false,
    ...options,
    method,
    url: `${Cypress.config('baseUrl')}${path}`,
    headers: requestHeaders,
  });
});

Cypress.Commands.add('expectJsonSchema', (body) => {
  Cypress.UserValidator.validateFullSchema(body);
});
