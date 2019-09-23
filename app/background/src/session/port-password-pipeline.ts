import {Observable} from "rxjs";
import {Session} from "./session";
import {filter, switchMap, tap} from "rxjs/operators";
import {fromMessages, portConnections$} from "../helpers";
import Port = chrome.runtime.Port;
import {FromPage2BackgroundMsg} from "../../../view/src/app/services/chrome-api-dto";

const session = new Session();
const passwordPort$: Observable<any> = portConnections$.pipe(
    filter((port: Port) => {
        console.log('port connected:', port.name, port);
        return port.name === 'port-password';
    }),
    tap((port: Port) => {
        console.log('post password=', session.password);
        port.postMessage({
            password: session.password
        });
    }),
    switchMap((port: Port) => {
        return fromMessages(port);
    }),
    tap((data: any) => {
        const {port, message} = data;
        const response = session.processMessageFromPage(message as FromPage2BackgroundMsg);
        if (response) {
            // response loop for login messages
            port.postMessage(response);
        }
    })
);

export function handlePasswordConnections() {

    passwordPort$.subscribe(() => {
    });
}
