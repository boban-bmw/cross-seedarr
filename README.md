# cross-seedarr

Cross seeding helper for radarr &amp; sonarr.

| Which problem does this solve?

You don't need to manually cross-seed a release among your many trackers.

## Installation and usage

Prerequisites: `git` and `node` (I recommend using [nvm](https://github.com/nvm-sh/nvm))

```
git clone https://github.com/boban-bmw/cross-seedarr.git
cd cross-seedarr && npm install --production
cp config.example.js config.js
# edit config.js to suit your needs
node index.js radarr sonarr --recent 14
```

All flags are optional. The `recent` flag will filter out movies/series added in the last x days.

`torrentDir` will contain all potential matching torrents - pass these to [autotorrent](https://github.com/JohnDoee/autotorrent).

`cross-seedarr` will not download duplicate `.torrent` files - so it recommended to use `autotorrent` without the `-d` flag

### Tested versions

- `radarr v2` - `v3` might work as well
- `sonarr v3`
- `node v14`
- `ubuntu v20` - other OS-es should work as well

## License

MIT
