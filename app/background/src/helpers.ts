import {Observable, Subject} from "rxjs";
import Port = chrome.runtime.Port;
import WalletConnect from "@walletconnect/browser/lib";

export type PortAndMessage = { port: Port, message: any };

export function logAndSendToPort(port: Port, message: any, logMarker?: string) {
    console.warn(`${logMarker}: ${JSON.stringify(message)}`);
    port.postMessage(message);
};

export function fromWcEvent(eventName: string, wc: WalletConnect): Subject<any> {
    const subject$ = new Subject<any>();
    wc.on(eventName, (error, payload) => {
        if (eventName === 'call_request' || eventName === 'connect' || eventName === 'disconnect') {
            // debugger
        }

        console.log(error, payload);
        if (error) {
            subject$.error(error);
        }

        console.log('next:', eventName, payload);
        subject$.next(payload);
    });
    return subject$;
}

export function fromMessages(port: Port): Observable<PortAndMessage> {
    const subject = new Subject<PortAndMessage>();
    port.onMessage.addListener((message: any) => {
        subject.next({port, message});
    });

    return subject.asObservable();
}

export function openWidget(): void {
    // const extensionId = chrome.runtime.id;
    // const url = `chrome-extension://${extensionId}/greeter`;
    const url = `index.html?state="registration/import"`;

    // chrome.tabs.create({url:"index.html?#/registration/import"});
    // debugger
    window.open(url, "extension_popup", "width=350,height=590,status=no,scrollbars=yes,resizable=no");
}

const portConnections$ = new Subject<Port>();
chrome.runtime.onConnect.addListener((port: Port) => {
    portConnections$.next(port);
});

export {portConnections$};


