const { sonarr } = require("./config");
const {
  delay,
  logger,
  mkdir,
  deleteEmptyFiles,
  eligibleRelease,
  validIndexers,
  recentlyDownloaded,
} = require("./util");
const makeClient = require("./client");
const downloadRelease = require("./download");

async function getSeasonReleases(sonarrApi, show, season) {
  const seasonName = `${show.title} (${show.year}) S${
    season.seasonNumber < 10 ? 0 : ""
  }${season.seasonNumber}`;

  let releases = [];

  try {
    logger.info(`Searching for ${seasonName}...`);

    const searchResults = (
      await sonarrApi.get(
        `/release?seriesId=${show.id}&seasonNumber=${season.seasonNumber}`
      )
    ).data.filter((result) => result.protocol === "torrent");

    releases = searchResults
      .filter(eligibleRelease(season.statistics.sizeOnDisk, sonarr.threshold))
      .filter(validIndexers(sonarr.ignoredIndexers));

    if (show.seasons.length > 1 && season.seasonNumber === 1) {
      const completeShowSize = show.seasons.reduce(
        (prev, next) => prev + next.statistics.sizeOnDisk,
        0
      );

      const completePacks = searchResults
        .filter(eligibleRelease(completeShowSize, sonarr.threshold))
        .filter(validIndexers(sonarr.ignoredIndexers));

      releases.push(...completePacks);
    }

    logger.info(
      `Found ${searchResults.length} results(s) - Eligible: ${releases.length}`
    );
  } catch (e) {
    logger.error(
      e,
      `An error occurred while searching for ${seasonName}, skipping...`
    );
  }

  return releases;
}

module.exports = async function sonarrFlow() {
  if (!sonarr || !sonarr.url || !sonarr.apiKey) {
    logger.warn("sonarr config unset, skipping...");
    return;
  }

  mkdir(sonarr.torrentDir);

  const sonarrApi = makeClient(sonarr, true);

  try {
    logger.info("Fetching series...");

    const { data: allSeries } = await sonarrApi.get("/series");

    const series = allSeries.filter(
      (series) => series.statistics.episodeFileCount > 0
    );

    logger.info("Fetching series complete - processing episodes...");

    let counter = 0;

    for (const show of series) {
      const { data: allEpisodeFiles } = await sonarrApi.get(
        `/episodeFile?seriesId=${show.id}`
      );

      for (const season of show.seasons) {
        const relevantEpisodes = allEpisodeFiles
          .filter((episode) => episode.seasonNumber === season.seasonNumber)
          .filter(recentlyDownloaded);

        if (
          season.monitored &&
          season.statistics.percentOfEpisodes === 100 &&
          relevantEpisodes.length > 0
        ) {
          const releases = await getSeasonReleases(sonarrApi, show, season);

          for (const release of releases) {
            try {
              await downloadRelease(sonarr.torrentDir, release);
            } catch (e) {
              logger.error(
                e,
                `An error occurred while saving ${release.title} from ${release.indexer}`
              );
            }
          }

          await delay();
        }
      }

      counter += 1;

      logger.info(
        `Progress: ${((counter / series.length) * 100).toFixed(
          2
        )}% (${counter}/${series.length})`
      );
    }

    deleteEmptyFiles(sonarr.torrentDir);
  } catch (e) {
    logger.error(e, "An error occurred while processing series");
  }
};
