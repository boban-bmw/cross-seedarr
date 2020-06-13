const axios = require("axios");

const { radarr } = require("./config");
const { delay } = require("./util");

async function getMovieReleases(radarrApi, movie) {
  const { movieFile } = movie;

  console.log(`Searching for ${movie.title} (${movie.year})...`);

  const { data: searchResults } = await radarrApi.get(
    `/release?movieId=${movie.id}`
  );

  const filteredResults = searchResults
    .filter((result) => result.protocol === "torrent")
    .filter(
      (result) => result.quality.quality.id === movieFile.quality.quality.id
    )
    .filter((result) => {
      const sizeDifference = Math.abs(movieFile.size - result.size);
      const sizeDifferencePercentage = sizeDifference / movieFile.size;

      return sizeDifferencePercentage < radarr.threshold / 100;
    });

  console.log(
    `Found ${searchResults.length} result(s) - Eligible: ${filteredResults.length}`
  );
}

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
    console.log("Fetching movies...");

    const { data: allMovies } = await radarrApi.get("/movie");

    const movies = allMovies.filter(
      (movie) => movie.monitored && movie.downloaded && movie.hasFile
    );

    console.log(
      `Fetching movies complete! Eligible movies found: ${movies.length}`
    );

    for (movie of movies.slice(0, 10)) {
      await getMovieReleases(radarrApi, movie);
      await delay();
    }
  } catch (e) {
    console.log(e);
  }
};
