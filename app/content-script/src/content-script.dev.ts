// @ts-ignore
import tpl from "./injectable.js";

// TODO: add development and production manifest, allow localhost:4200 only in development manifest
const hrefRe = /https:\/\/www\.binance.org\/..\/unlock/;
if (hrefRe.test(window.location.href) || window.location.href.startsWith('http://localhost:4200')) {

    const script = document.createElement('script');
    script.type = "text/javascript";
    script.innerHTML = tpl;
    document.body.appendChild(script);

    window.addEventListener("message", (event) => {
        console.log('received in content script:', event);

        // We only accept messages from ourselves
        if (event.source != window)
            return;

        if (event.data.type && (event.data.type === "FROM_PAGE")) {
            console.log("Content script received: " + event.data.text);
            const wcLink = event.data.text;
            chrome.runtime.sendMessage({wcLink}, () => {
            });
        }

        // TODO: communicate via local storage
        // if (event.data.type && (event.data.type === "TO_BG")) {
        //     console.log("TO_BG: " + event.data);
        //     port.postMessage(event.data.msg);
        // }

    }, false);
}
// // TODO: Move this to dev build, security gap
// port.onMessage.addListener((msg: Event) => {
//     console.log('to page:', msg);
//     window.postMessage({type: 'TO_PAGE', msg}, "*");
// });


// console.defaultLog('1', window.logs)
//
// const interval = setInterval(() => {
//     //const hasUnlockWcButton = document.getElementById("Unlock_Wallet_Connect");
//     const qrWasShown = document.querySelector(".qrcode-box")
//     if (!qrWasShown)
//         return
//
//     const msgItem = window.logs.slice().reverse()
//       .find((item) => item && item[0] === 'WalletConnect URI' && msgItem[1])
//
//     if (msgItem && msgItem[1]) {
//         const uri = msgItem[1]
//         window.console.defaultLog(uri)
//         clearInterval(interval)
//     }
// }, 1000);
//
// // debugger;
//
// // const interval = setInterval(() => {
// //     //const hasUnlockWcButton = document.getElementById("Unlock_Wallet_Connect");
// //     const qrWasShown = document.querySelector(".qrcode-box")
// //
// //     const msgItem = window.x1.slice().reverse()
// //         .find((item) => item && item[0] === 'WalletConnect URI' && msgItem[1])
// //
// //     if (msgItem && msgItem[1]) {
// //         const uri = msgItem[1]
// //         window.console.defaultLog(uri);
// //         clearInterval(interval)
// //     }
// // }, 1000)
//
// // var port = chrome.runtime.connect();
// //
// // window.addEventListener("message", function(event) {
// //     // We only accept messages from ourselves
// //     if (event.source != window)
// //         return;
// //
// //     if (event.data.type && (event.data.type == "FROM_PAGE")) {
// //         console.log("Content script received: " + event.data.text);
// //         port.postMessage(event.data.text);
// //     }
// // }, false);
//
// // document.getElementById("theButton").addEventListener("click",
// //   function() {
// //       window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
// //   }, false);
