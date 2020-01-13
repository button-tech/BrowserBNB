# BrowserBNB 

[![Build Status](https://travis-ci.org/button-tech/BrowserBNB.svg?branch=master)](https://travis-ci.org/button-tech/BrowserBNB)

MetaMask like widget for Binance Chain ❤️
    
<img src="https://github.com/button-tech/BrowserBNB/raw/master/docs/img/previewgit.gif" alt="" data-canonical-src="https://github.com/button-tech/BrowserBNB/raw/master/docs/img/previewgit.gif" width="250" height="450" />

## Step 1 (Registration or Import) 

- [x] Mnemonic Creation
- [x] Mnemonic Import
- [x] Keystore Creation
- [x] Keystore Import
- [x] Private key Creation
- [x] Private key Import
- [x] Address from Mnemonic
- [x] Address from Private Key
- [x] Address from Keystore
- [x] Lock Mnemnonic with password
- [x] Lock Keystore with password
- [x] Lock Private Key with password
- [x] Unlock Keystore with password
- [x] Unlock Private Key with password
- [x] Set encrypted Mnemonic to local storage
- [x] Set encrypted keystore to local storage
- [x] Set encrypted Private Key to local storage
- [x] Get balance from Account
- [x] Multiple accounts support
- [x] Storing private key during active session

Navigation 
![Navigation](https://raw.githubusercontent.com/button-tech/BrowserBNB/master/docs/img/CreateOrImport.png)

## Step 2 (Infrastructure)
 - [x] Add background.js and sessions support
 - [x] Make TS wrapper over BNB JS SDK
 - [x] Send to address support 
 - [x] Tokens support 
 - [x] Multiple accounts support
 - [x] Add first docs and Travis
 - [x] Add BNB TS Wrapper 
 - [x] Add forms for feedback and make widget public
 - [x] Add State service
 - [x] Add BIP44 Derivation support
 
 ## Step 3 (Final Beta Public)
  - [x] Background logic 
  - [x] Settings support 
  - [x] Custom alerts service + UI
  - [x] Linting of project
  - [x] Fix wrappers over JS SDK
  - [x] Multiple fiat currencies support
  - [x] Multiple network support
  - [ ] Multiple languages support
  - [ ] Integration tests + BNB SDK tests
  - [x] Repo update
  - [ ] Free from bootstrap + material wastes 
  - [x] WalletConnect + DEX support 
  - [ ] Forms to Rx forms
  
### Browser BNB TODO:

### Fixes:
- [ ] Refactor all forms in SEND
- [x] Fix Connect Icon 
- [x] Fix bug: whenever WC connected or not, UI should show display  correct status. Play around on reconnect flow on seprate web page first (**CHECK**)
- [ ] Make isolated demo that will illustrate bug related to communication with background (Artem)
- [ ] Put build instructions into README.md

#### Dev experience:
- [ ] Share files common `ts` files between background and UI builds
- [ ] Cleanup(delete) some files in background
- [ ] Content Script that serves as proxy (dev build for chrome exension)
- [ ] BnbSDK with rollup & TreeShaking
- [ ] Enable `Ivy` compiler, maybe we can avoid work arounds on communication with background.(**Check `npm run build:watch`**)
- [ ] Sample with hot reloading of chrome extension, check is it possible with our complex build
- [ ] Post build step in `angular.json` to rebuild background
- [ ] Move content-script to seprate folder from background. (use `/src/(bg|content|view)`)


### Improvements:
- [ ] Internalization i18n (It supports extraction of tokens(`extract-i18n`), checkout here: https://medium.com/frontend-fun/angular-introduction-to-internationalization-i18n-28226a85e04e#targetText=Angular%20i18n%20tooling%20extracts%20the,application%20with%20the%20targeted%20language.)
- [ ] Think on fullscreen layout
- [ ] Restore session timeout, support it as a configurable feature
- [ ] Open widget window when request comes from Binance DEX. Only when windows, doesn't open. In case window is open, try to highlite it. 

