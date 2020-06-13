const axios = require("axios");

const { radarr } = require("./config");

module.exports = async function radarrFlow() {
  if (!radarr.url || !radarr.apiKey) {
    console.log("radarr url or api key missing, skipping...");
    return;
  }

  const radarrApi = axios.create({
    baseURL: `${radarr.url}/api`,
    headers: {
      "X-Api-Key": radarr.apiKey,
    },
  });

  try {
    const { data: movies } = await radarrApi.get("/movie");

    movies
      .filter((movie) => movie.monitored && movie.downloaded && movie.hasFile)
      .forEach((movie) => console.log(movie));
  } catch (e) {
    console.log(e);
  }
};
