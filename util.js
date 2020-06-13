const fs = require("fs");
const pino = require("pino");

const { timeout } = require("./config");

module.exports = {
  delay() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, timeout * 1000);
    });
  },
  logger: pino({
    prettyPrint: true,
  }),
  mkdir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  },
};
