console.log("Hi");

const re = /https:\/\/www\.binance.org\/..\/unlock/;
if (re.test(window.location.href)) {

    // const div = document.createElement('script');
    const script = document.createElement('script');
    script.type = "text/javascript";
    script.innerHTML = ` 
       function test() {
            setInterval(() => {console.log(2);}, 1000);
            alert(1);
        };
       console.log('tesssss');
       test();
    `;

    document.body.appendChild(script);

    //console.log("script=", script);


    // document.getElementsByTagName('head')[0].appendChild(script);
    //
    // defaultLog = console.log.bind(console)
    // logs = []
    //
    // // debugger;
    // console.log = function () {
    //     // default &  console.log()
    //     console.defaultLog.apply(console, arguments)
    //     // new & array data
    //     logs.push(Array.from(arguments))
    // }
    //
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


