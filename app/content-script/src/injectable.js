var intervalId = setInterval(() => {
    const btn = document.getElementById('Unlock_Wallet_Connect');
    if(btn){
        clearInterval(intervalId);
        btn.click();
    }
}, 100);

const defaultLog = console.log.bind(console);
console.log = function () {
    defaultLog.apply(console, arguments);
    if(arguments[0]==='WalletConnect URI' ){
        window.postMessage({ type: "FROM_PAGE", text: arguments[1] }, "*");
    }
};
