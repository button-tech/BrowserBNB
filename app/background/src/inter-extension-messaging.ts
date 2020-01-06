// This file contains provides wrappers that allow to interact with different parts of chrome extension in reactive way
import Port = chrome.runtime.Port;
import {BehaviorSubject} from "rxjs";
import {filter} from "rxjs/operators";

export function logAndSendToPort(port: Port, message: any, logMarker?: string) {
    // console.warn(`${logMarker}: ${JSON.stringify(message)}`);
    port.postMessage(message);
}

const wcLink$ = new BehaviorSubject<string>('');
const walletConnectLinkFromContentScript$ = wcLink$.asObservable().pipe(
    filter((wcLink) => {
        return !!wcLink;
    })
);

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    const {wcLink} = request;
    if (request.wcLink) {
        sendResponse("Ok");
        wcLink$.next(wcLink);
    }
});

export {
    walletConnectLinkFromContentScript$
}

