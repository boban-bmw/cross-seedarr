module.exports = {
  // amount of time to wait between search indexers requests in seconds
  timeout: 5,
  // if you aren't using radarr, leave the url and apiKey empty
  radarr: {
    // url you use to access radarr
    // https://your.seedbox.url/radarr
    // in case you are using http auth, the url should look like this
    // https://username:password@your.seedbox.url/radarr
    url: "",
    // radarr api key, found in settings -> general
    apiKey: "",
    // error threshold in % - torrent size difference which is ignored (treated as same release)
    // this is useful for eg. samples which some trackers include and others don't
    threshold: 5,
    // absolute path to the directory where we save matches
    torrentDir: "/tmp/torrents",
    // we search all "search-enabled" indexers - results from indexers listed below will be ignored
    // eg. ignoredIndexers: ["IPT", "TL"]
    ignoredIndexers: [],
  },
  sonarr: {
    // same as for radarr
    url: "",
    apiKey: "",
    threshold: 5,
    torrentDir: "/tmp/torrents",
    ignoredIndexers: [],
  },
};
