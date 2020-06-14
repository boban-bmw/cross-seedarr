# cross-seedarr

Cross seeding helper for radarr &amp; sonarr.

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

### Versions

Tested with `node` v14, `radarr` v2 on `ubuntu` v20 - but it should work on other operating systems without issue.

## License

MIT
