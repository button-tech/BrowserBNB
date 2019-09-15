// TODO: Add dev build && allow localshot only in dev build
// TODO: remove localhost from manifest
const hrefRe = /https:\/\/www\.binance.org\/..\/unlock/;
if (hrefRe.test(window.location.href) || window.location.href.startsWith('http://localhost:4200')) {

    const script = document.createElement('script');
    script.type = "text/javascript";

    // TODO: move to and import separate js file
    script.innerHTML = `
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
    `;

    document.body.appendChild(script);

    window.addEventListener("message", (event) => {
        console.log('received in contenet script:', event);

        // We only accept messages from ourselves
        if (event.source != window)
            return;

        if (event.data.type && (event.data.type === "FROM_PAGE")) {
            console.log("Content script received: " + event.data.text);
            const wcLink = event.data.text;
            chrome.runtime.sendMessage({wcLink}, () => {});
        }
    }, false);
}

