console.log('ABC')

// TODO: support not only `en`
if (window.location.href.startsWith("https://www.binance.org/en/unlock")) {

    console.log('----')


    defaultLog = console.log.bind(console)
    logs = []

    // debugger;
    console.log = function () {
        // default &  console.log()
        console.defaultLog.apply(console, arguments)
        // new & array data
        logs.push(Array.from(arguments))
    }

    console.defaultLog('1', window.logs)

    const interval = setInterval(() => {
        //const hasUnlockWcButton = document.getElementById("Unlock_Wallet_Connect");
        const qrWasShown = document.querySelector(".qrcode-box")
        if (!qrWasShown)
            return

        const msgItem = window.logs.slice().reverse()
            .find((item) => item && item[0] === 'WalletConnect URI' && msgItem[1])

        if (msgItem && msgItem[1]) {
            const uri = msgItem[1]
            window.console.defaultLog(uri)
            clearInterval(interval)
        }
    }, 1000)

    //debugger;

    // const interval = setInterval(() => {
    //     //const hasUnlockWcButton = document.getElementById("Unlock_Wallet_Connect");
    //     const qrWasShown = document.querySelector(".qrcode-box")
    //
    //     const msgItem = window.x1.slice().reverse()
    //         .find((item) => item && item[0] === 'WalletConnect URI' && msgItem[1])
    //
    //     if (msgItem && msgItem[1]) {
    //         const uri = msgItem[1]
    //         window.console.defaultLog(uri);
    //         clearInterval(interval)
    //     }
    // }, 1000)
}


