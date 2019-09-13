import { combineLatest, from, Observable, Subject } from "rxjs";
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

// const sessionRequestPayload = JSON.parse('{"id":1568231137072078,"jsonrpc":"2.0","method":"session_request","params":[{"peerId":"442662df-5f27-4555-9014-d6b4de5b027d","peerMeta":{"description":"","url":"https://www.binance.org","icons":["https://dex-bin.bnbstatic.com/0ec4e7a/favicon.png","https://dex-bin.bnbstatic.com/0ec4e7a/favicon.png"],"name":"Binance | Dex Trading | Decentralized Exchange | Binance.org"},"chainId":null}]}');
// of(sessionRequestPayload);

const walletConnectPort$: Observable<any> = portConnections$.pipe(
  filter((port: Port) => {
      return port.name === 'port-wallet-connect';
  }),
  tap(() => {
      console.log('port-wallet-connect !!!');
  }),
  shareReplay(1)
);


const wcLinkFromContentScript$ = new Subject<string>();
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const {wcLink} = request;
    console.log(request, sender, sendResponse);
    if (request.wcLink) {
        sendResponse("Ok");
        wcLinkFromContentScript$.next(wcLink);
    }
});


const reactiveWc$: Observable<ReactiveWc> = wcLinkFromContentScript$.pipe(
  switchMap((wcLink: string) => {
      console.log(wcLink);

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
      return new ReactiveWc(instance);
  }),
);

const privateKey$ = reactiveWc$.pipe(
  switchMap((reactiveWc: ReactiveWc) => {

      const fromUi$ = reactiveWc.sessionRequest$.pipe(
        switchMap((sessionRequest: any) => {
            openWidget();
            return walletConnectPort$.pipe(
              tap((port) => {
                  console.log('send sessionRequest:', sessionRequest);
                  port.postMessage({sessionRequest})
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

            debugger
            return {reactiveWc, privateKey};
        })
      )
  }),
);

// const privateKey = '90335b9d2153ad1a9799a3ccc070bd64b4164e9642ee1dd48053c33f9a3a05e9';
// const zz = JSON.parse('{"id":1,"jsonrpc":"2.0","method":"bnb_sign","params":[{"account_number":"260658","chain_id":"Binance-Chain-Tigris","data":null,"memo":"","msgs":[{"id":"8BCB4071024E9B57F8F79ACB81E4195BB1F6066A-2","ordertype":2,"price":169607,"quantity":5800000000,"sender":"bnb13095qugzf6d4078hnt9creqetwclvpn2htdccj","side":1,"symbol":"PYN-C37_BNB","timeinforce":1}],"sequence":"1","source":"0"}]}');
// const [rawTransaction] = zz.params;
// const signed = signTransaction(privateKey, rawTransaction);
// console.log(signed);
// debugger

const x$ = privateKey$.pipe(
  switchMap((x: any) => {
      const {reactiveWc, privateKey} = x;
      debugger

      // const txSign = await this.signTransaction(rawTx);
      // await walletConnector.approveRequest({
      //     id: payload.id,
      //     result: JSON.stringify(txSign),
      // });

      // public async approveRequestCall(payload: any) {
      //     const walletConnector = this.instance;
      //
      //     if (payload.method === "bnb_sign") {
      //         const [rawTx] = payload.params;
      //         const txSign = await this.signTransaction(rawTx);
      //         await walletConnector.approveRequest({
      //             id: payload.id,
      //             result: JSON.stringify(txSign),
      //         });
      //     }
      // }

      return combineLatest([reactiveWc.callRequest$, walletConnectPort$]).pipe(
        tap((x: any[]) => {
            console.log(x);
            debugger
        }),
        takeUntil(reactiveWc.disconnect$),
        filter((x: any[]) => {

            debugger
            const [callRequest] = x;
            return callRequest.method === 'bnb_sign';
        }),
        switchMap((x: any[]) => {

            debugger

            // Send to UI
            const [callRequest, port] = x;
            port.postMessage({
                callRequest
            });

            return fromMessages(port).pipe(
              take(1),
              filter((responseFromUi: PortAndMessage) => {
                  const {message} = responseFromUi;
                  return message.isOrderApproved;
              }),
              tap(() => {
                  debugger
                  const [rawTransaction] = callRequest.params;
                  const txSign = signTransaction(privateKey, rawTransaction);

                  reactiveWc.instance.approveRequest({
                      id: callRequest.id,
                      result: JSON.stringify(txSign),
                  });
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

// chrome.runtime.onConnect.addListener((port: Port) => {
//
//     // console.log('port connected');
//     // port.onMessage.addListener((msg: MessageBase) => {
//     //
//     //     // TODO: check message type, call widget awnd give widget ability to approve.
//     //     console.log("message received:" + msg);
//     //     // approveSession(msg);
//     //
//     //     if (msg && msg.type) {
//     //
//     //         if (msg.type === 'initWalletConnectSession') {
//     //             // const link = (msg as FromContent2BackgroundMsg).wcDeepLink;
//     //             // approveSession(link);
//     //         } else {
//     //             const response = session.processMessageFromPage(msg as FromPage2BackgroundMsg);
//     //             if (response) {
//     //                 port.postMessage(response);
//     //             }
//     //         }
//     //     }
//     // });
// });
//
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
