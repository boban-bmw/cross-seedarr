module.exports = {
  // amount of time to wait between requests in seconds
  timeout: 5,
  radarr: {
    // url you use to access radarr
    // in case you are using http auth, the url should look like this
    // https://username:password@your.seedbox.url/radarr
    url: "https://your.seedbox.url/radarr",
    // radarr api key, found in settings -> general
    apiKey: "yourApiKey",
    // error threshold in % - torrent size difference which is ignored (treated as same release)
    // this is useful for eg. samples which some trackers include and others don't
    threshold: 5,
  },
};
