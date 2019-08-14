// import * as passworder from 'browser-passworder';
// import { timer } from "rxjs";
import { WalletConnectController } from "../services/walletconnect";

// async function f() {
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



export const s = 5;


const wcSession = 'wc:b1548cf8-49ab-4289-abf5-1cc4cd108a6d@1?bridge=https%3A%2F%2Fwallet-bridge.binance.org&key=8057158df84cca0773fbdcdb01a6bee6739cf340a00f82834ab13d83fa0c54ff';

const privateKey = '90335b9d2153ad1a9799a3ccc070bd64b4164e9642ee1dd48053c33f9a3a05e9';
const wc = new WalletConnectController(privateKey, wcSession);
console.log(wc);

// setTimeout(() => {wc.approveSession();}, 2000);

// f();
