# cross-seedarr

Cross seeding helper for radarr &amp; sonarr.

| Which problem does this solve?

You don't need to manually cross-seed a release among your many trackers.

## Installation and usage

Prerequisites: `git` and `node`

```
git clone https://github.com/boban-bmw/cross-seedarr.git
cd cross-seedarr && npm install --production
cp config.example.js config.js
# edit config.js to suit your needs
npm start
```

`torrentDir` will now contain all potential matching torrents - pass these to [autotorrent](https://github.com/JohnDoee/autotorrent).

### Tested versions

- `radarr v2` - `v3` might work as well
- `sonarr v3`
- `node v14`
- `ubuntu v20` - other OS-es should work as well

## License

MIT
