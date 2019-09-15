import { BehaviorSubject, combineLatest, from, of, merge, Observable, Subject, NEVER } from "rxjs";
import { filter, map, shareReplay, switchMap, take, takeUntil, tap } from "rxjs/operators";
import WalletConnect from "@walletconnect/browser/lib";
import { ReactiveWc } from "./walletconnect/walletconnect";
import { fromMessages, openWidget, PortAndMessage, portConnections$ } from "./backgroud-common";
import { handlePasswordConnections } from "./backgroud-port-password";
import { signTransaction } from "./walletconnect/binancecrypto";
import Port = chrome.runtime.Port;

// import Port = chrome.runtime.Port;
// let a = "https://dex.binance.org/api/v1/account/bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu";
// const x = fetch(a).then((x) => {
//     x.json().then((obj) => {
//         debugger
//     })
// })
//

console.log('background.ts !');

handlePasswordConnections();

let isWcConnected = false;
let lastWcUri = '';

// const sessionRequestPayload = JSON.parse('{"id":1568231137072078,"jsonrpc":"2.0","method":"session_request","params":[{"peerId":"442662df-5f27-4555-9014-d6b4de5b027d","peerMeta":{"description":"","url":"https://www.binance.org","icons":["https://dex-bin.bnbstatic.com/0ec4e7a/favicon.png","https://dex-bin.bnbstatic.com/0ec4e7a/favicon.png"],"name":"Binance | Dex Trading | Decentralized Exchange | Binance.org"},"chainId":null}]}');
// of(sessionRequestPayload);

const logAndSendToPort = (port: Port, message: any, logMarker?: string ) => {
    console.warn(`${logMarker}: ${JSON.stringify(message)}`);
    port.postMessage(message);
};

// TODO: refactor and merge with subject below
const _walletConnectPort$: Observable<any> = portConnections$.pipe(
  filter((port: Port) => {
      return port.name === 'port-wallet-connect';
  }),
  tap(() => {
      console.log('port-wallet-connect !!!');
  }),
);

_walletConnectPort$.subscribe((port: any) => {
    port.onDisconnect.addListener(() => {
        wcPortSubject$.next(null);
    });

    logAndSendToPort(port, {isWcConnected}, '_walletConnectPort$.subscribe(49)');
    // port.postMessage({isWcConnected});

    wcPortSubject$.next(port);
});

const wcPortSubject$ = new BehaviorSubject<Port | null>(null);
const wcPort$ = wcPortSubject$.asObservable();

const wcLinkFromContentScript$ = new Subject<string>();
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const {wcLink} = request;
    console.log(request, sender, sendResponse);
    if (request.wcLink) {
        sendResponse("Ok");
        wcLinkFromContentScript$.next(wcLink);
    }
});

const manualReconnect$ = new Subject<any>();
const manualReconnectToLastWcLink$ = manualReconnect$.pipe(
  map(() => {
        return lastWcUri;
    }
  ),
  filter((x: string) => {
      return !!x;
  })
);

const reactiveWc$: Observable<ReactiveWc> = merge(wcLinkFromContentScript$, manualReconnectToLastWcLink$).pipe(
  switchMap((wcLink: string) => {
      console.log(wcLink);

      lastWcUri = wcLink;

      console.log(`new WalletConnect to uri ${wcLink}`);
      const instance = new WalletConnect({
          uri: wcLink
      });

      return from(instance.createSession()).pipe(
        map(() => {
            return instance;
        })
      );
  }),
  map((instance: WalletConnect) => {
      console.log('new ReactiveWc(instance)');
      return new ReactiveWc(instance);
  }),
  shareReplay(1),
);

const wcState$ = reactiveWc$.pipe(
  switchMap((reactiveWc: ReactiveWc) => {
      console.log('switch to: reactiveWc.isConnected$');
      return reactiveWc.isConnected$;
  }),
  tap((isWcConnected: boolean) => {
      console.log('isWcConnected');
      const port = wcPortSubject$.getValue();
      if (port) {
          logAndSendToPort(port, {isWcConnected}, 'wcState$(112)');
          // port.postMessage({
          //     isWcConnected
          // });
      }
  })
);

wcState$.subscribe((isWcConnected: boolean) => {
    console.log('wcState$.subscribe:', isWcConnected);
});

const privateKey$ = reactiveWc$.pipe(
  switchMap((reactiveWc: ReactiveWc) => {

      const fromUi$: Observable<PortAndMessage> = reactiveWc.sessionRequest$.pipe(
        switchMap((sessionRequest: any) => {
            openWidget();

            return wcPort$.pipe(
              filter((port: Port | null) => {
                  return port !== null;
              }),
              map((port) => {
                  return port as Port;
              }),
              tap((port: Port) => {
                  console.log('send sessionRequest:', sessionRequest);
                  // Port, could be disconnected (track - onDisconnect handler, probably is need take until upstream)
                  // be carefull we have shareReplay(1)
                  // port.postMessage({sessionRequest})
                  logAndSendToPort(port, {sessionRequest}, 'wcState$(143)');
              }),
              switchMap((port: Port) => {
                  return fromMessages(port);
              }),
            );
        }),
      );

      return fromUi$.pipe(
        take(1),
        filter((responseFromUi: PortAndMessage) => {
            const {message} = responseFromUi;
            return message.isApproved;
        }),
        map((responseFromUi: PortAndMessage) => {

            const {bnbAddress, privateKey} = responseFromUi.message;
            reactiveWc.instance.approveSession({
                chainId: 1,
                accounts: [bnbAddress],
            });

            return {reactiveWc, privateKey};
        })
      )
  }),
);

const wcConnectManagementFromUi$ = wcPort$.pipe(
  switchMap((port: Port | null) => {
      console.log('wcConnectManagementFromUi$ port:', port);
      if (!port)
          return NEVER;

      return fromMessages(port);
  }),
  filter((x: PortAndMessage) => {
      const { message} = x;
      console.log('wcConnectManagementFromUi$ filter msg:', message);
      return message.updateConnectionState;
  }),
  switchMap((x: PortAndMessage) => {
      const { message} = x;
      console.log('wcConnectManagementFromUi$ switchMap:', message);
      return reactiveWc$.pipe(
        tap((reactiveWc: ReactiveWc) => {
            console.log('wcConnectManagementFromUi$ reactiveWc:', reactiveWc);
            console.log('wcConnectManagementFromUi$ msg.newState:', message.newState);

            message.newState
              ? manualReconnect$.next(true)
              : reactiveWc.instance.killSession();
        })
      );
  })
);

wcConnectManagementFromUi$.subscribe(() => {
    //
});

//
// const privateKey = '90335b9d2153ad1a9799a3ccc070bd64b4164e9642ee1dd48053c33f9a3a05e9';
// const zz = JSON.parse('{"id":1,"jsonrpc":"2.0","method":"bnb_sign","params":[{"account_number":"260658","chain_id":"Binance-Chain-Tigris","data":null,"memo":"","msgs":[{"id":"8BCB4071024E9B57F8F79ACB81E4195BB1F6066A-2","ordertype":2,"price":169607,"quantity":5800000000,"sender":"bnb13095qugzf6d4078hnt9creqetwclvpn2htdccj","side":1,"symbol":"PYN-C37_BNB","timeinforce":1}],"sequence":"1","source":"0"}]}');
// const [rawTransaction] = zz.params;
// const signed = signTransaction(privateKey, rawTransaction);
// console.log(signed);
// debugger
//

const x$ = privateKey$.pipe(
  switchMap((x: any) => {
      const {reactiveWc, privateKey} = x;

      return combineLatest([reactiveWc.callRequest$, wcPort$]).pipe(
        tap((x: any[]) => {
            console.log(x);
        }),

        takeUntil(reactiveWc.disconnect$),
        filter((x: any[]) => {
            const [callRequest] = x;
            return callRequest.method === 'bnb_sign'; // bnb_tx_confirmation
        }),

        switchMap((x: any[]) => {
            // Send to UI
            const [callRequest, port] = x;

            if (!port) {
                console.log('!port');
                return NEVER; // Do nothing, or better wait
            }

            logAndSendToPort(port, {callRequest}, '_walletConnectPort$.subscribe(236)');
            // port.postMessage({
            //     callRequest
            // });

            return fromMessages(port).pipe(
              take(1),
              filter((responseFromUi: PortAndMessage) => {
                  const {message} = responseFromUi;
                  return message.orderApproveResponse;
              }),
              tap((responseFromUi: PortAndMessage) => {
                  const {message} = responseFromUi;

                  if (message.isOrderApproved) {
                      const [rawTransaction] = callRequest.params;
                      const txSign = signTransaction(privateKey, rawTransaction);
                      reactiveWc.instance.approveRequest({
                          id: callRequest.id,
                          result: JSON.stringify(txSign),
                      });

                  } else {
                      reactiveWc.instance.rejectRequest({
                          id: callRequest.id,
                          error: {message: "Failed or Rejected Request"},
                      });
                  }
              })
            );

        }),
      );
  })
);

x$.subscribe((data: any) => {
    const {port, message} = data;
    console.log(port, message);
});

// // setTimeout(() => {
// //     //chrome.tabs.create({url:"index.html?#/registration/import"});
// //
// //     // //const extensionId = chrome.runtime.id;
// //     // //const url = `chrome-extension://${extensionId}/greeter`;
// //     // const url = `index.html?state="registration/import"`;
// //     //
// //     // // host: "dfiibgbgnmgilhfanmbhcgbfoadmmadd"
// //     // // hostname: "dfiibgbgnmgilhfanmbhcgbfoadmmadd"
// //     // // href: "chrome-extension://dfiibgbgnmgilhfanmbhcgbfoadmmadd/registration/import"
// //     // // origin: "chrome-extension://dfiibgbgnmgilhfanmbhcgbfoadmmadd"
// //     // // pathname: "/registration/import"
// //     //
// //     // window.open(url, "extension_popup", "width=350,height=590,status=no,scrollbars=yes,resizable=no");
// // }, 300);
