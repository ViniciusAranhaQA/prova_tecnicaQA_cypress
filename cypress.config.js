const { defineConfig } = require('cypress');
require('dotenv').config();

const getGoRestToken = () => {
  return process.env.GOREST_TOKEN || process.env.gorestToken || process.env.CYPRESS_gorestToken || '';
};

module.exports = defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: 'https://gorest.co.in/public/v2',
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    video: true,
    setupNodeEvents(on, config) {
      config.gorestToken = getGoRestToken();
      return config;
    },
  },
});
