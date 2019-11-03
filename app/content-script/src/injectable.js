// setTimeout(() => {
//
//     if (window.isConnected) {
//         return;
//     }
//
//     var intervalId = setInterval(() => {
//         const btn = document.getElementById('Unlock_Wallet_Connect');
//         if (btn) {
//             clearInterval(intervalId);
//             btn.click();
//         }
//     }, 100);
//
//     // var stepOneIntervalId = setInterval(() => {
//     //     const btn = document.getElementById('connectBtn');
//     //     if (btn) {
//     //         clearInterval(stepOneIntervalId);
//     //         btn.click();
//     //     }
//     // }, 100);
//     //
//     // var stepTwoIntervalId = setInterval(() => {
//     //     const btn = document.getElementById('use-walletconnect');
//     //     if (btn) {
//     //         clearInterval(stepTwoIntervalId);
//     //         btn.click();
//     //     }
//     // }, 100);
//
// }, 1500);


window.wasShown = false;
const defaultLog = console.log.bind(console);
console.log = function () {
    defaultLog.apply(console, arguments);

    // if (arguments[0] && arguments[0].startsWith && arguments[0] === "isAuthorized") {
    //     window.isConnected = true;
    //     return;
    // }
    if (window.wasShown) {
        return;
    }

    if (arguments[0] === 'WalletConnect URI') {
        window.postMessage({type: "FROM_PAGE", text: arguments[1]}, "*");
        window.wasShown = true;
        return;
    }

    // if (arguments[0] && arguments[0].startsWith && arguments[0].startsWith("wc:")) {
    //     window.wasShown = true;
    //     window.postMessage({type: "FROM_PAGE", text: arguments[0]}, "*");
    //     return;
    // }
};
