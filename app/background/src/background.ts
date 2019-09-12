import { from, Observable, Subject } from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import WalletConnect from "@walletconnect/browser/lib";
import { ReactiveWc } from "./walletconnect/walletconnect";
import Port = chrome.runtime.Port;
import { fromMessages, openWidget, PortAndMessage, portConnections$ } from "./backgroud-common";
import { handlePasswordConnections } from "./backgroud-port-password";

// import Port = chrome.runtime.Port;
// let a = "https://dex.binance.org/api/v1/account/bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu";
// const x = fetch(a).then((x) => {
//     x.json().then((obj) => {
//         debugger
//     })
// })
//

console.log('Hi!');

handlePasswordConnections();

// const sessionRequestPayload = JSON.parse('{"id":1568231137072078,"jsonrpc":"2.0","method":"session_request","params":[{"peerId":"442662df-5f27-4555-9014-d6b4de5b027d","peerMeta":{"description":"","url":"https://www.binance.org","icons":["https://dex-bin.bnbstatic.com/0ec4e7a/favicon.png","https://dex-bin.bnbstatic.com/0ec4e7a/favicon.png"],"name":"Binance | Dex Trading | Decentralized Exchange | Binance.org"},"chainId":null}]}');
// of(sessionRequestPayload);

const walletConnectPort$: Observable<any> = portConnections$.pipe(
  filter((port: Port) => {
      return port.name === 'port-wallet-connect';
  }),
  tap(() => {
      console.log('port-wallet-connect !!!');
  })
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

const awaitOfApprovalOrRejection = reactiveWc$.pipe(
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
        tap((responseFromUi: PortAndMessage) => {
            const {bnbAddress} = responseFromUi.message;
            reactiveWc.instance.approveSession({
                chainId: 1,
                accounts: [bnbAddress],
            });
        })
      )
  }),
);

awaitOfApprovalOrRejection.subscribe((data: any) => {
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
