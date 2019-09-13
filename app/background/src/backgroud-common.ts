import { Observable, Subject } from "rxjs";
import Port = chrome.runtime.Port;

export type PortAndMessage = { port: Port, message: any };

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
    window.open(url, "extension_popup", "width=350,height=590,status=no,scrollbars=yes,resizable=no");
}

const portConnections$ = new Subject<Port>();
chrome.runtime.onConnect.addListener((port: Port) => {
    portConnections$.next(port);
});

export { portConnections$ };


