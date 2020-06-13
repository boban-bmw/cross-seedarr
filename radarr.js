const axios = require("axios");

const { radarr } = require("./config");
const { delay, logger, mkdir } = require("./util");
const downloadRelease = require("./download");

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
      })
      .filter(
        (release) => radarr.ignoredIndexers.indexOf(release.indexer) === -1
      );

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
  if (!radarr || !radarr.url || !radarr.apiKey) {
    logger.warn("radarr config unset, skipping...");
    return;
  }

  mkdir(radarr.torrentDir);

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

      for (release of releases) {
        try {
          await downloadRelease(radarr.torrentDir, release);
        } catch (e) {
          logger.error(
            e,
            `An error ocurred while saving ${release.title} from ${release.indexer}`
          );
        }
      }

      await delay();
    }
  } catch (e) {
    logger.error(e, `An error occurred while processing movies`);
  }
};
