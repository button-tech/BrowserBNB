import * as passworder from 'browser-passworder';
import { timer } from "rxjs";
import { WalletConnectController } from "./services/walletconnect";

// async function f() {
//
//
//     chrome.runtime.onConnect.addListener(function (port) {
//         //console.log("Connected .....");
//         port.onMessage.addListener(function (msg) {
//             console.log("message recieved" + msg);
//             port.postMessage("Hi Popup.js");
//         });
//     });
//
//
//     const data = {a: 1};
//
//     const password = '11';
//
//     timer(0, 2000).subscribe(() => {
//         console.log('1123');
//     });
//
//     const encrypted = await passworder.encrypt(password, data);
//     console.log(encrypted);
//
//     let a = "https://dex.binance.org/api/v1/account/bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu";
//     const x = fetch(a).then((x) => {
//         x.json().then((obj) => {
//             debugger
//         })
//     })
// }


const wcSession = 'wc:aa3adeaa-01c4-4c56-9175-ed2e92e7e6b7@1?bridge=https%3A%2F%2Fwallet-bridge.binance.org&key=f67503f6a6296115c7d007332bfb3e97e84e376513c76f402af166cbc67f2a87';
const privateKey = '90335b9d2153ad1a9799a3ccc070bd64b4164e9642ee1dd48053c33f9a3a05e9';
const wc = new WalletConnectController(privateKey, wcSession);

// setTimeout(() => {wc.approveSession();}, 2000);

// f();
