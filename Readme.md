# Mine4aCause POC

This project uses Monero through CoinHive to generate hashes for the CoinHive XMR miner. The purpose of this is to demonstrate
how a browser extension can be built to mine Monero as a beginning for Mine4aCause.

This project contains 4 items that you can play with with thanks to [Jan Cazala](https://github.com/cazala) and his
[coin-hive](https://github.com/cazala/coin-hive) project.

1. A docker based miner - update the `Dockerfile` with your own public site token
1. A simple-ui miner that will load in a page
1. A chrome browser extension `simple-miner` that will mine while it is open
1. A custom chrome browser extension `background-miner` that will mine in the background even when the UI hasn't been popped up.

To build and run the docker image...

```bash
$ docker build --rm -t coin-hive
$ docker run --rm coint-hive
```

To load an extension...

1. Make sure you've retrieved the coinhive js files; it appears as though chrome extensions don't like loading things remotely - `$ ./install-js`
1. Load the chrome extension page in your browser: [chome://extensions](chrome://extensions/)
1. Check `Developer mode` on the top right
1. Click on `Load unpacked extention...` to load it from your finder
