const TESTNET_ENDPOINT_ASIA = "https://testnet-dex-asiapacific.binance.org";
const TESTNET_ENDPOINT_DEFAULT = "https://testnet-dex.binance.org";
const MAINNET_ENDPOINT_DEFAULT = "https://dex.binance.org";

let CURRENT_ACCOUNT = 0;
let CURRENT_KEY = "";
let CURRENT_ADDRESS = "";
let CURRENT_CLIENT;
let isActive = false;

// Returns a client of BNB
async function getBaseClient() {
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
    const pvtKey = BNB.BNB.crypto.getPrivateKeyFromMnemonic(mnemonic);
    setKeystoreToLS(CURRENT_ACCOUNT, BNB.BNB.crypto.generateKeyStore(pvtKey, password));
}

// locks private key into keysotore
// mnemonic - mnemonic
// password - password
function lockPrivateKey(pvtKey, password) {
    setKeystoreToLS(CURRENT_ACCOUNT, BNB.BNB.crypto.generateKeyStore(pvtKey, password));
}

// Unlocks private key from keystore
// password - password
function unlockPrivateKey(password) {
    let keystore = localStorage.getItem(CURRENT_ACCOUNT);
    const pvtKey = BNB.BNB.crypto.getPrivateKeyFromKeyStore(keystore, password)
}

// Return  address from private key
// pvtKey - private key
function getAddressFromPrivateKey(pvtKey) {
    const publicKey = BNB.BNB.crypto.getPublicKeyFromPrivateKey(pvtKey);
    return BNB.BNB.crypto.getAddressFromPublicKey(publicKey);
}

function getAddressFromMnemonic(mnemonic) {
    const pvtKey = BNB.BNB.crypto.getPrivateKeyFromMnemonic(mnemonic);
    const publicKey = BNB.BNB.crypto.getPublicKeyFromPrivateKey(pvtKey);
    return BNB.BNB.crypto.getAddressFromPublicKey(publicKey);

}

function getAddressFromKeystore(keystore, password) {
    const pvtKey = BNB.BNB.crypto.getPrivateKeyFromKeyStore(keystore, password);
    const publicKey = BNB.BNB.crypto.getPublicKeyFromPrivateKey(pvtKey);
    return BNB.BNB.crypto.getAddressFromPublicKey(publicKey);
}

async function getBalanceOfAddress(address) {
    let res;
    if (isActive) {
        try {
            res = await client.getBalance(address);
        }
        catch (e) {
            res = 0;
        }
    } else {
        await initSession(askForPassword())
    }
}

async function initSession(password, account = 0) {
    CURRENT_ACCOUNT = account;
    CURRENT_KEY = unlockPrivateKey(password);
    CURRENT_ADDRESS = getAddressFromPrivateKey(CURRENT_KEY);
    CURRENT_CLIENT = await getBaseClient();
    await CURRENT_CLIENT.setPrivateKey(CURRENT_KEY);
    CURRENT_CLIENT.useDefaultSigningDelegate();
    CURRENT_CLIENT.useDefaultBroadcastDelegate();
    await CURRENT_CLIENT.initChain();
    isActive = true;
}

async function askForPassword() {
    let password = "";
    return password;
}