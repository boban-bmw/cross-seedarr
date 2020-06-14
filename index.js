const radarrFlow = require("./radarr");
const sonarrFlow = require("./sonarr");

async function start() {
  await radarrFlow();
  await sonarrFlow();
}

start();
