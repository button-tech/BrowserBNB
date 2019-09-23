// @ts-ignore
import * as consoleListener from './injectable.js';

const hrefRe = /https:\/\/www\.binance.org\/..\/unlock/;
if (hrefRe.test(window.location.href)) {

    const script = document.createElement('script');
    script.type = "text/javascript";
    // TODO: fix that on binance DOM side
    script.innerHTML = consoleListener;
    document.body.appendChild(script);

    window.addEventListener("message", (event) => {
        console.log('received in contenet script:', event);

        // We only accept messages from ourselves
        if (event.source != window)
            return;

        if (event.data.type && (event.data.type === "FROM_PAGE")) {
            console.log("Content script received: " + event.data.text);
            const wcLink = event.data.text;
            chrome.runtime.sendMessage({wcLink}, () => {
            });
        }
    }, false);
}

