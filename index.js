const { argv } = require("yargs")
  .usage("Usage: node $0 <command> [options]")
  .command("radarr", "Search for movies.")
  .command("sonarr", "Search for shows.")
  .demandCommand(1, 2)
  .number("recent")
  .describe(
    "recent",
    "Consider movies/shows added in the last x days. If omitted, everything is searched for."
  )
  .example(
    "node $0 radarr sonarr --recent 14",
    "Search radarr and sonarr for all movies/shows added in the last 14 days."
  )
  .help("help");

const radarrFlow = require("./radarr");
const sonarrFlow = require("./sonarr");

async function start() {
  if (argv._.indexOf("radarr") > -1) {
    await radarrFlow();
  }

  if (argv._.indexOf("sonarr") > -1) {
    await sonarrFlow();
  }
}

start();
