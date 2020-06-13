const axios = require("axios");

const { radarr } = require("./config");
const { delay } = require("./util");

async function getMovieReleases(radarrApi, movie) {
  const movieName = `${movie.title} (${movie.year})`;
  let releases = [];

  try {
    const { movieFile } = movie;

    console.log(`Searching for ${movieName}...`);

    const { data: searchResults } = await radarrApi.get(
      `/release?movieId=${movie.id}`
    );

    releases = searchResults
      .filter((result) => result.protocol === "torrent")
      .filter((result) => {
        const sizeDifference = Math.abs(movieFile.size - result.size);
        const sizeDifferencePercentage = sizeDifference / movieFile.size;

        return sizeDifferencePercentage < radarr.threshold / 100;
      });

    console.log(
      `Found ${searchResults.length} result(s) - Eligible: ${releases.length}`
    );
  } catch (e) {
    console.log(
      `An error ocurred while searching for ${movieName}, skipping...`,
      e
    );
  }

  return releases;
}

module.exports = async function radarrFlow() {
  if (!radarr.url || !radarr.apiKey) {
    console.log("radarr url or api key missing, skipping...");
    return;
  }

  const radarrApi = axios.create({
    baseURL: `${radarr.url}/api`,
    headers: {
      "X-Api-Key": radarr.apiKey,
    },
    timeout: 60000,
  });

  try {
    console.log("Fetching movies...");

    const { data: allMovies } = await radarrApi.get("/movie");

    const movies = allMovies.filter(
      (movie) => movie.monitored && movie.downloaded && movie.hasFile
    );

    console.log(
      `Fetching movies complete - Eligible movies found: ${movies.length}`
    );

    for (movie of movies) {
      const releases = await getMovieReleases(radarrApi, movie);
      console.log(releases[0]);
      await delay();
    }
  } catch (e) {
    console.log(`An error occurred in the radarr flow`, e);
  }
};
