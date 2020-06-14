const axios = require("axios");

const { sonarr } = require("./config");
const { logger, mkdir } = require("./util");
const makeClient = require("./client");

module.exports = async function sonarrFlow() {
  if (!sonarr || !sonarr.url || !sonarr.apiKey) {
    logger.warn("sonarr config unset, skipping...");
    return;
  }

  mkdir(sonarr.torrentDir);

  const sonarrApi = makeClient(sonarr);

  try {
    logger.info("Fetching series...");

    const { data: allSeries } = await sonarrApi.get("/series");

    const series = allSeries.filter((series) => series.episodeFileCount > 0);

    logger.info(
      `Fetching series complete - Eligible series found: ${series.length}`
    );

    let counter = 0;

    for (const show of series) {
      logger.info(show);
    }
  } catch (e) {
    logger.error(e, "An error ocurred while processing series");
  }
};
