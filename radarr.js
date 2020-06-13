const axios = require("axios");

const { radarr } = require("./config");
const { delay, logger } = require("./util");

async function getMovieReleases(radarrApi, movie) {
  const movieName = `${movie.title} (${movie.year})`;
  let releases = [];

  try {
    const { movieFile } = movie;

    logger.info(`Searching for ${movieName}...`);

    const { data: searchResults } = await radarrApi.get(
      `/release?movieId=${movie.id}`
    );

    releases = searchResults
      .filter((result) => result.protocol === "torrent")
      .filter((result) => {
        const sizeDifference = Math.abs(movieFile.size - result.size);
        const sizeDifferencePercentage = sizeDifference / movieFile.size;

        return sizeDifferencePercentage < radarr.threshold / 100;
      });

    logger.info(
      `Found ${searchResults.length} result(s) - Eligible: ${releases.length}`
    );
  } catch (e) {
    logger.error(
      e,
      `An error ocurred while searching for ${movieName}, skipping...`
    );
  }

  return releases;
}

module.exports = async function radarrFlow() {
  if (!radarr.url || !radarr.apiKey) {
    logger.warn("radarr url or api key missing, skipping...");
    return;
  }

  const radarrApi = axios.create({
    baseURL: `${radarr.url}/api`,
    headers: {
      "X-Api-Key": radarr.apiKey,
    },
    timeout: 60000,
  });

  try {
    logger.info("Fetching movies...");

    const { data: allMovies } = await radarrApi.get("/movie");

    const movies = allMovies.filter(
      (movie) => movie.monitored && movie.downloaded && movie.hasFile
    );

    logger.info(
      `Fetching movies complete - Eligible movies found: ${movies.length}`
    );

    for (movie of movies) {
      const releases = await getMovieReleases(radarrApi, movie);
      logger.info(releases[0]);
      await delay();
    }
  } catch (e) {
    logger.error(e, `An error occurred in the radarr flow`);
  }
};
