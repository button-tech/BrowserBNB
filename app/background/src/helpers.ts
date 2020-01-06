import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import Port = chrome.runtime.Port;
import {filter, switchMap} from "rxjs/operators";

export type PortAndMessage = { port: Port, message: any };

export function fromMessages(port: Port): Observable<PortAndMessage> {
    const subject = new Subject<PortAndMessage>();
    port.onMessage.addListener((message: any) => {
        subject.next({port, message});
    });
    return subject.asObservable();
}


// TODO: implement openWidget with connected ports
export function openWidget(): Observable<NullablePort> {
    // const extensionId = chrome.runtime.id;
    // const url = `chrome-extension://${extensionId}/greeter`;
    const url = `index.html?state="registration/import"`;

    // chrome.tabs.create({url:"index.html?#/registration/import"});
    // debugger
    window.open(url, "extension_popup", "width=350,height=590,status=no,scrollbars=yes,resizable=no");
    return walletConnectPortUi$;
    
    // Return Observable that takes latest

    // filter((port: Port | null) => {
    //     return port !== null;
    // }),
    // map((port) => {
    //     return port as Port;
    // }),
}

// TODO: export as observable
const portConnections$ = new Subject<Port>();
chrome.runtime.onConnect.addListener((port: Port) => {
    portConnections$.next(port);
});


type NullablePort = Port | null;

// let isWcConnected = false;

function getUiWcPort(): Observable<NullablePort> {

    return portConnections$.pipe(
        filter((port: Port) => {
            return port.name === 'port-wallet-connect'; // TODO to constants
        }),
        switchMap((port: Port) => {

            // port.postMessage({isWcConnectedisWcConnected}); // Shouldn't be here

            const subject = new BehaviorSubject<NullablePort>(port);
            port.onDisconnect.addListener(() => {
                subject.next(null);
            });
            return subject.asObservable();
        }),
    );
}

const walletConnectPortUi$ = getUiWcPort();

export {portConnections$, walletConnectPortUi$};


