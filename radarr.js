const { radarr } = require("./config");
const {
  delay,
  logger,
  mkdir,
  deleteEmptyFiles,
  eligibleRelease,
  validIndexers,
} = require("./util");
const makeClient = require("./client");
const downloadRelease = require("./download");

async function getMovieReleases(radarrApi, movie) {
  const movieName = `${movie.title} (${movie.year})`;
  let releases = [];

  try {
    const { movieFile } = movie;

    logger.info(`Searching for ${movieName}...`);

    const searchResults = (
      await radarrApi.get(`/release?movieId=${movie.id}`)
    ).data.filter((result) => result.protocol === "torrent");

    releases = searchResults
      .filter(eligibleRelease(movieFile.size, radarr.threshold))
      .filter(validIndexers(radarr.ignoredIndexers));

    logger.info(
      `Found ${searchResults.length} result(s) - Eligible: ${releases.length}`
    );
  } catch (e) {
    logger.error(
      e,
      `An error occurred while searching for ${movieName}, skipping...`
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

  const radarrApi = makeClient(radarr);

  try {
    logger.info("Fetching movies...");

    const { data: allMovies } = await radarrApi.get("/movie");

    const movies = allMovies.filter(
      (movie) => movie.monitored && movie.downloaded && movie.hasFile
    );

    logger.info(
      `Fetching movies complete - Eligible movies found: ${movies.length}`
    );

    let counter = 0;

    for (const movie of movies) {
      const releases = await getMovieReleases(radarrApi, movie);

      for (const release of releases) {
        try {
          await downloadRelease(radarr.torrentDir, release);
        } catch (e) {
          logger.error(
            e,
            `An error occurred while saving ${release.title} from ${release.indexer}`
          );
        }
      }

      counter += 1;

      logger.info(
        `Progress: ${((counter / movies.length) * 100).toFixed(
          2
        )}% (${counter}/${movies.length})`
      );

      await delay();
    }

    deleteEmptyFiles(radarr.torrentDir);
  } catch (e) {
    logger.error(e, "An error occurred while processing movies");
  }
};
