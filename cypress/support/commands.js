Cypress.Commands.add('apiRequest', (method, path, options = {}) => {
  const baseUrl = 'https://gorest.co.in/public/v2';
  const authToken = Cypress.config('gorestToken') || process.env.GOREST_TOKEN || process.env.gorestToken || process.env.CYPRESS_gorestToken || '';

  const defaults = {
    method,
    url: `${baseUrl}${path}`,
    headers: {
      Accept: 'application/json',
    },
    failOnStatusCode: false,
  };

  const requestHeaders = { ...defaults.headers, ...(options.headers || {}) };

  if (!requestHeaders.Authorization && authToken && authToken !== 'YOUR_TOKEN_HERE') {
    requestHeaders.Authorization = `Bearer ${authToken}`;
  }

  return cy.request({ ...defaults, ...options, headers: requestHeaders });
});

Cypress.Commands.add('expectJsonSchema', (body) => {
  expect(body).to.have.all.keys('id', 'name', 'email', 'gender', 'status');
});
