const path = require("path");
const axios = require("axios");
const fs = require("fs");

const { logger } = require("./util");

module.exports = function downloadRelease(basePath, release) {
  return new Promise((resolve, reject) => {
    const { downloadUrl } = release;

    const fileName = `[${release.indexer}]${release.title}.torrent`;

    const savePath = path.resolve(basePath, fileName);

    if (fs.existsSync(savePath)) {
      logger.info(`${fileName} already exists, skipping...`);

      resolve();

      return;
    }

    const writeStream = fs.createWriteStream(savePath);

    writeStream.on("finish", () => {
      logger.info(
        `Successfully downloaded ${release.title} from ${release.indexer}`
      );

      resolve();
    });

    writeStream.on("error", reject);

    axios
      .get(downloadUrl, {
        responseType: "stream",
      })
      .then((response) => {
        response.data.pipe(writeStream);
      })
      .catch((e) => {
        logger.error(
          e,
          `An error occurred while downloading ${release.title} from ${release.indexer}`
        );

        resolve();
      });
  });
};
