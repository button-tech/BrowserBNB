import { Observable } from "rxjs";
import { Session } from "./session/session";
import { filter, switchMap, tap } from "rxjs/operators";
import Port = chrome.runtime.Port;
import { fromMessages, portConnections$ } from "./backgroud-common";


const session = new Session();
console.log('Hi 2!');

export function handlePasswordConnections() {
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
      })
    );

    passwordPort$.pipe(
      switchMap((port: Port) => {
          return fromMessages(port);
      }),
      tap((data: any) => {
          const {port, message} = data;
          const response = session.processMessageFromPage(message as FromPage2BackgroundMsg);
          if (response) {
              // Send response with password
              port.postMessage(response);
          }
      })
    ).subscribe(() => {
        // response loop for login messages
    });
}
