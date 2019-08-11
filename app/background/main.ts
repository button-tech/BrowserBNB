import * as passworder from 'browser-passworder';
import { timer } from "rxjs";
import { WalletConnectController } from "./services/walletconnect";

async function f() {


    chrome.runtime.onConnect.addListener(function (port) {
        console.log("Connected .....");
        port.onMessage.addListener(function (msg) {
            console.log("message recieved" + msg);
            port.postMessage("Hi Popup.js");
        });
    });


    const data = {a: 1};

    const password = '11';

    timer(0, 2000).subscribe(() => {
        console.log('1123');
    });

    const encrypted = await passworder.encrypt(password, data);
    console.log(encrypted);

    let a = "https://dex.binance.org/api/v1/account/bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu";
    const x = fetch(a).then((x) => {
        x.json().then((obj) => {
            debugger
        })
    })
}


const wcSession = 'wc:2bd03b1f-732f-49ff-b1c5-8e8b69b9e674@1?bridge=https%3A%2F%2Fwallet-bridge.binance.org&key=03f8971ee7ae68736fd8a433799d5d76fb3691275f596b2f163ccd1a1a5e33fa';
const privateKey = '90335b9d2153ad1a9799a3ccc070bd64b4164e9642ee1dd48053c33f9a3a05e9';
const wc = new WalletConnectController(privateKey, wcSession);

setTimeout(() => {wc.approveSession();}, 2000);

f();
