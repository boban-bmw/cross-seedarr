const axios = require("axios");

module.exports = function makeClient(settings, v3 = false) {
  return axios.create({
    baseURL: `${settings.url}/api${v3 ? "/v3" : ""}`,
    headers: {
      "X-Api-Key": settings.apiKey,
    },
    timeout: 120000,
  });
};
