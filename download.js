const path = require("path");
const axios = require("axios");
const fs = require("fs");

const { logger } = require("./util");

module.exports = async function downloadRelease(basePath, release) {
  return new Promise(async (resolve, reject) => {
    try {
      const { downloadUrl } = release;

      const fileName = `[${release.indexer}]${release.title}.torrent`;

      const savePath = path.resolve(basePath, fileName);

      if (fs.existsSync(savePath)) {
        logger.info(`${savePath} already exists, skipping...`);

        resolve();

        return;
      }

      const writer = fs.createWriteStream(savePath);

      const response = await axios.get(downloadUrl, {
        responseType: "stream",
      });

      response.data.pipe(writer);

      writer.on("finish", () => {
        logger.info(
          `Successfully downloaded ${release.title} from ${release.indexer}`
        );

        resolve();
      });
      writer.on("error", reject);
    } catch (e) {
      logger.error(
        e,
        `An error ocurred while downloading ${release.title} from ${release.indexer}`
      );
    }
  });
};
