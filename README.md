# cross-seedarr

Cross seeding helper for radarr &amp; sonarr.

| Which problem does this solve?

You don't need to manually cross-seed a release among your many trackers.

## How it works

It searches all your search-enabled indexers for a movie/show and matches releases within `config.threshold` percent in size.
This is done because certain trackers rename releases, include/exclude samples/nfos, etc.

Only monitored and downloaded items are considered. For TV shows, only season packs and complete packs are searched for.

## Installation

Prerequisites: `git` and `node` (I recommend using [nvm](https://github.com/nvm-sh/nvm))

```
git clone https://github.com/boban-bmw/cross-seedarr.git
cd cross-seedarr && npm install --production
cp config.example.js config.js
# edit config.js to suit your needs
```

## Usage

```
Usage: node index.js <command> [options]

Commands:
  index.js radarr  Search for movies.
  index.js sonarr  Search for shows.

Options:
  --version  Show version number                                       [boolean]
  --recent   Consider movies/shows downloaded in the last x days. If omitted,
             everything is searched for.                                [number]
  --verbose  Turn off log pretty printing.                             [boolean]
  --help     Show help                                                 [boolean]

Examples:
  node index.js radarr sonarr --recent 14  Search radarr and sonarr for all
                                           movies/shows downloaded in the last
                                           14 days.
```

`torrentDir` will contain all potential matching torrents - pass these to [autotorrent](https://github.com/JohnDoee/autotorrent).

`cross-seedarr` will not download duplicate `.torrent` files - so it recommended to use `autotorrent` without the `-d` flag

### Tested versions

- `radarr v2` - `v3` might work as well
- `sonarr v3`
- `node v14`
- `ubuntu v20` - other OS-es should work as well

## License

MIT
