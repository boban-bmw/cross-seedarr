const axios = require("axios");

module.exports = function makeClient(settings) {
  return axios.create({
    baseURL: `${settings.url}/api`,
    headers: {
      "X-Api-Key": settings.apiKey,
    },
    timeout: 120000,
  });
};
