// console.log("Hi");
// TODO: we can simplify logic since we have match restriction in the manifest
//
const re = /https:\/\/www\.binance.org\/..\/unlock/;
if (re.test(window.location.href)) {

    const script = document.createElement('script');
    script.type = "text/javascript";
    script.innerHTML = `
        const defaultLog = console.log.bind(console);
        console.log = function () {
            defaultLog.apply(console, arguments);
            if(arguments[0]==='WalletConnect URI' ){
                window.postMessage({ type: "FROM_PAGE", text: arguments[1] }, "*");
            }
        };
    `;
    document.body.appendChild(script);

    const port = chrome.runtime.connect();
    window.addEventListener("message", function (event) {
        console.log('received in contenet script:', event);
        // We only accept messages from ourselves
        if (event.source != window)
            return;

        if (event.data.type && (event.data.type == "FROM_PAGE")) {
            console.log("Content script received: " + event.data.text);
            // debugger
            port.postMessage(event.data.text);
        }
    }, false);

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
}


