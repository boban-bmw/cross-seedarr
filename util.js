const fs = require("fs");
const path = require("path");
const { argv } = require("yargs");
const logger = require("pino")({
  prettyPrint: !argv.verbose,
});
const moment = require("moment");

const { timeout } = require("./config");

const now = moment();

module.exports = {
  delay() {
    return new Promise((resolve) => {
      logger.info(`Waiting ${timeout} seconds...`);

      setTimeout(() => {
        resolve();
      }, timeout * 1000);
    });
  },
  logger,
  mkdir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  },
  deleteEmptyFiles(dir) {
    const fileNames = fs.readdirSync(dir);

    for (const fileName of fileNames) {
      const filePath = path.join(dir, fileName);
      const file = fs.statSync(filePath);

      if (!file.isDirectory() && file.size === 0) {
        fs.unlinkSync(filePath);

        logger.info(`Deleted invalid file ${filePath}`);
      }
    }
  },
  eligibleRelease(size, threshold) {
    return (release) => {
      const sizeDifference = Math.abs(size - release.size);
      const sizeDifferencePercentage = sizeDifference / size;

      return sizeDifferencePercentage < threshold / 100;
    };
  },
  validIndexers(ignoredIndexers) {
    return (release) => ignoredIndexers.indexOf(release.indexer) === -1;
  },
  recentlyDownloaded(item) {
    if (!argv.recent) {
      return true;
    }

    return now.diff(moment(item.dateAdded), "day") <= argv.recent;
  },
};
