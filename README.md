# BrowserBNB 

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/648aaec139fa4e868397722c1921e470)](https://www.codacy.com/gh/button-tech/BrowserBNB?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=button-tech/BrowserBNB&amp;utm_campaign=Badge_Grade)
[![Build Status](https://travis-ci.org/button-tech/BrowserBNB.svg?branch=master)](https://travis-ci.org/button-tech/BrowserBNB)

MetaMask like widget for Binance Chain ❤️

Currently is on public [BETA](https://chrome.google.com/webstore/detail/bnb-browser/eeflaanifildahldmpahjmgmgippmgne) 
Please, rate us there!

### Fixes:
- [x] Refactor all forms in SEND
- [x] Fix Connect Icon 
- [x] Fix bug: whenever WC connected or not, UI should show display  correct status. Play around on reconnect flow on seprate web page first (**CHECK**)
- [ ] Make isolated demo that will illustrate bug related to communication with background (Artem)
- [ ] Put build instructions into README.md
- [ ] Angular webpack custom build and move content-script to seprate folder from background. (use `/src/(bg|content|view)`)
- [ ] Cleanup(delete) some files in background
- [ ] BnbSDK with rollup & TreeShaking
- [ ] Enable `Ivy` compiler, maybe we can avoid work arounds on communication with background.(**Check `npm run build:watch`**)
- [ ] Internalization i18n (It supports extraction of tokens(`extract-i18n`), checkout here: https://medium.com/frontend-fun/angular-introduction-to-internationalization-i18n-28226a85e04e#targetText=Angular%20i18n%20tooling%20extracts%20the,application%20with%20the%20targeted%20language.)
- [ ] Think on fullscreen layout
- [ ] Restore session timeout, support it as a configurable feature
- [ ] Open widget window when request comes from Binance DEX. Only when windows, doesn't open. In case window is open, try to highlite it
- [ ] Material Design refactor
- [ ] Multiple chains with TS Wallet Core
- [ ] Redisign of architecture to make it modular for supporting new blockchains
- [ ] BNB / Web3 provider for Dapps
- [ ] Wallet Connect Update 
- [ ] Azure pipelines and tests coverage 

