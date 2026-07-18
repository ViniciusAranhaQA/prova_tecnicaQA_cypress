const { defineConfig } = require('cypress');
require('dotenv').config();

const getGoRestToken = () => {
  return process.env.GOREST_TOKEN || process.env.gorestToken || process.env.CYPRESS_gorestToken || '';
};

module.exports = defineConfig({
  allowCypressEnv: false,
  e2e: {
    setupNodeEvents(on, config) {
      config.gorestToken = getGoRestToken();
      return config;
    },
  },
});
