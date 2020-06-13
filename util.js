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
  logger: pino(
    pino.destination({
      dest: "./cross-seedarr.log",
      sync: false,
    })
  ),
};
