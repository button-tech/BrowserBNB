#!/bin/bash
pwd
npm install
browserify -o --standalone BNB convert.js > ../app/view/src/assets/binance/bnbSDK.js
