const { timeout } = require("./config");

module.exports = {
  delay() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, timeout * 1000);
    });
  },
};
