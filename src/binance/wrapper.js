const TESTNET_ENDPOINT_ASIA = "https://testnet-dex-asiapacific.binance.org";
const TESTNET_ENDPOINT_DEFAULT = "https://testnet-dex.binance.org";
const MAINNET_ENDPOINT_DEFAULT = "https://dex.binance.org";

// Returns a client of BNB
function getBaseClient() {
    return new BNB.BNB(MAINNET_ENDPOINT_DEFAULT);
}

// Return a new mnemonic
function createMnemonic() {
    return BNB.BNB.crypto.generateMnemonic();
}

// Return a new private key
function createPriavteKey() {
    return BNB.BNB.crypto.generatePrivateKey();
}

// Return a keystore
// pvtKey - private key
// password - password
function createKeystore(pvtKey = BNB.BNB.crypto.generatePrivateKey(), password) {
    return BNB.BNB.crypto.generateKeyStore(pvtKey, password)
}

// Sets keystore to localstorage
function setKeystoreToLS(index, keystore) {
    localStorage.setItem(index, keystore);
}

// locks mnemonic into keysotore
// mnemonic - mnemonic
// password - password
function lockMnemonic(mnemonic, password) {
    const pvtKey = crypto.getPrivateKeyFromMnemonic(mnemonic);
    return BNB.BNB.crypto.generateKeyStore(pvtKey, password);
}