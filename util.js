const fs = require("fs");
const logger = require("pino")({
  prettyPrint: true,
});

const { timeout } = require("./config");

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
};
