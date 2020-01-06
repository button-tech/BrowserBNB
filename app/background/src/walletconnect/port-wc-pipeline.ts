import {combineLatest, from, merge, NEVER, Observable} from "rxjs";
import {filter, map, shareReplay, switchMap, take, takeUntil, tap} from "rxjs/operators";
import WalletConnect from "@walletconnect/browser/lib";
import {signTransaction} from "./binancecrypto";
import Port = chrome.runtime.Port;
import {ReactiveWc} from "./reactiveWc";
import {fromMessages, openWidget, PortAndMessage} from "../helpers";
import {walletConnectLinkFromContentScript$} from "../inter-extension-messaging";

// let latestWalletConnectUri = '';
// const manualReconnect$ = new Subject<any>();
// const manualReconnectToLastWcLink$ = manualReconnect$.pipe(
//     map(() => latestWalletConnectUri),
//     filter((x: string) => !!x)
// );
//
// walletConnectLinkFromContentScript$
//
//

// Должны модифицировать UI на Binance (добавля кнопку connect)

// Добавить кнопку Connect with BrowserBNB

// ContentScript -- Send Link --> Background Script --> Wallet Connect
// UI <--Connection request details-- Background Script <-- Connection Request -- Wallet Connect
// User -- Ok --> UI --> Background Script -- approve request -->  Wallet Connect
//         UI(Подсвечивается как подключенный) <--connected-- Background Script -- connected <-- Wallet Connect
//
//         UI --disconnect--> background --> WalletConnect
//         UI --connect--> background --> WalletConnect
//
//         Open UI <-- background <--call_request--WalletConnect
//
//         UI -- open chrome port -->
//         UI <-- background <--call_request--WalletConnect
//
// walletConnectLinkFromUi$ (should remember )

// Streams of reactive wrapped wallet connect
const reactiveWc$: Observable<ReactiveWc> = merge(walletConnectLinkFromContentScript$, walletConnectLinkFromUi$).pipe(
    switchMap((uri: string) => {

        // console.log(wcLink);
        // latestWalletConnectUri = uri; // HERE we have reconnect pipeline
        // console.log(`new WalletConnect to uri ${wcLink}`);

        const instance = new WalletConnect({uri});

        return from(instance.createSession()).pipe(
            map(() => {
                return instance;
            })
        );
    }),
    map((instance: WalletConnect) => {
        // console.log('new ReactiveWc(instance)');
        return new ReactiveWc(instance);
    }),
    shareReplay(1),
);

const wcState$ = reactiveWc$.pipe(
    switchMap((reactiveWc: ReactiveWc) => {
        console.log('switch to: reactiveWc.isConnected$');
        return reactiveWc.isConnected$;
    }),
    tap((isWcConnectedNewState: boolean) => {
        console.log('isWcConnectedNewState:', isWcConnectedNewState);
        isWcConnected = isWcConnectedNewState;
        const uiPort = wcPortSubject$.getValue(); // Port should be wrapped, so we have logging
        if (uiPort) {
            logAndSendToPort(uiPort, {isWcConnected}, ''); // Notify UI that we are connected
        }
    })
);

const actionsFromUi$ = wcPort$.pipe(
    switchMap((port: Port | null) => {
        console.log('wcConnectManagementFromUi$ port:', port);
        if (!port)
            return NEVER;

        return fromMessages(port); // Странный порт который включен только тогда, когда
    }),
    filter((x: PortAndMessage) => {
        const {message} = x;
        // console.log('wcConnectManagementFromUi$ filter msg:', message);
        return message.updateConnectionState; // TODO: rename to connect and disconnect
    }),
    switchMap((x: PortAndMessage) => {
        const {message} = x;
        // console.log('wcConnectManagementFromUi$ switchMap:', message);
        return reactiveWc$.pipe(
            tap((reactiveWc: ReactiveWc) => {
                // console.log('wcConnectManagementFromUi$ reactiveWc:', reactiveWc);
                // console.log('wcConnectManagementFromUi$ msg.newState:', message.newState);

                message.newState
                    ? manualReconnect$.next(true) // Here is reconnect to the same URL
                    : reactiveWc.instance.killSession();
            })
        );
    })
);


const privateKey$ = reactiveWc$.pipe(
    switchMap((reactiveWc: ReactiveWc) => {

        const fromUi$: Observable<PortAndMessage> = reactiveWc.sessionRequest$.pipe(
            switchMap((sessionRequest: any) => {
                openWidget();

                // Latest port wcPort$()
                return wcPort$.pipe(
                    // filter((port: Port | null) => {
                    //     return port !== null;
                    // }),
                    // map((port) => {
                    //     return port as Port;
                    // }),
                    tap((port: Port) => {
                        console.log('send sessionRequest:', sessionRequest);
                        // Port, could be disconnected (track - onDisconnect handler, probably is need take until upstream)
                        // be careful we have shareReplay(1)
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

const walletConnectMessageProcessingPipeline$ = privateKey$.pipe(
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

// Pipelines activation
export function handleWalletConnectConnections() {
    merge(
        wcState$,
        actionsFromUi$,

        // Just some logs here
        walletConnectMessageProcessingPipeline$.pipe(
            tap((data: any) => {
                const {port, message} = data;
                console.log(port, message);
            })
        )
    ).subscribe();

    // wcState$.subscribe(() => {
    // });
    //
    // // TODO: implement as a single pipeline
    // wcConnectActionsFromUi$.subscribe(() => {
    // });
    //
    // walletConnectMessageProcessingPipeline$.subscribe((data: any) => {
    //     const {port, message} = data;
    //     console.log(port, message);
    // });
}
