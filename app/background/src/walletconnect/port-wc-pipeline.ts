import {BehaviorSubject, combineLatest, from, merge, NEVER, Observable, Subject} from "rxjs";
import {debounceTime, filter, map, shareReplay, switchMap, take, takeUntil, tap} from "rxjs/operators";
import WalletConnect from "@walletconnect/browser/lib";
import {signTransaction} from "./binancecrypto";
import Port = chrome.runtime.Port;
import {ReactiveWc} from "./reactiveWc";
import {fromMessages, logAndSendToPort, openWidget, PortAndMessage, portConnections$} from "../helpers";

let isWcConnected = false;
let lastWcUri = '';

type NullablePort = Port | null;

function getWcPort(): BehaviorSubject<NullablePort> {
    const wcPortSubject$ = new BehaviorSubject<Port | null>(null);

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

        port.postMessage({isWcConnected});
        wcPortSubject$.next(port);
    });
    return wcPortSubject$;
}

const wcPortSubject$ = getWcPort();
const wcPort$ = wcPortSubject$.asObservable();

const wcLinkFromContentScript$ = new Subject<string>();
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const {wcLink} = request;
    // debugger
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
    debounceTime(300),
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
    tap((isWcConnectedNewState: boolean) => {
        console.log('isWcConnectedNewState:', isWcConnectedNewState);
        isWcConnected = isWcConnectedNewState;
        const port = wcPortSubject$.getValue();
        if (port) {
            logAndSendToPort(port, {isWcConnected}, 'wcState$(99)');
        }
    })
);

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
                // debugger
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

const wcConnectActionsFromUi$ = wcPort$.pipe(
    switchMap((port: Port | null) => {
        console.log('wcConnectManagementFromUi$ port:', port);
        if (!port)
            return NEVER;

        return fromMessages(port);
    }),
    filter((x: PortAndMessage) => {
        const {message} = x;
        console.log('wcConnectManagementFromUi$ filter msg:', message);
        return message.updateConnectionState;
    }),
    switchMap((x: PortAndMessage) => {
        const {message} = x;
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

const walletConnectMessageProcessingPipeline$ = privateKey$.pipe(
    switchMap((x: any) => {
        const {reactiveWc, privateKey} = x;

        return combineLatest([reactiveWc.callRequest$, wcPort$]).pipe(
            tap((x: any[]) => {
                // debugger
                console.log(x);
            }),

            takeUntil(reactiveWc.disconnect$),
            filter((x: any[]) => {
                const [callRequest] = x;
                return callRequest.method === 'bnb_sign'
                    || callRequest.method === 'get_accounts'
                    || callRequest.method === 'trust_signTransaction';
                // bnb_tx_confirmation
            }),
            switchMap((x: any[]) => {
                // Send to UI
                const [callRequest, port] = x;

                if (callRequest.method === 'get_accounts') {
                    // debugger
                    reactiveWc.instance.approveRequest({
                        id: callRequest.id,
                        result: [{
                            "address": "cosmos1phzk96xke3wf9esuys7hkllpltx57sjrhdqymz",
                            "network": 118
                        }],
                    });
                    return NEVER;
                }

                if (!port) {
                    console.log('!port');
                    return NEVER; // Do nothing, or better wait
                }

                console.log("SEND TO PORT:", callRequest);
                logAndSendToPort(port, {callRequest}, '_walletConnectPort$.subscribe(236)');
                // port.postMessage({
                //     callRequest
                // });

                return fromMessages(port).pipe(
                    take(1),
                    filter((responseFromUi: PortAndMessage) => {
                        console.log("RESPONSE FROM UI:", responseFromUi);
                        const {message} = responseFromUi;
                        return message.orderApproveResponse;
                    }),
                    tap((responseFromUi: PortAndMessage) => {
                        const {message} = responseFromUi;

                        if (message.isOrderApproved && message.signedTx) {
                            console.log("GOT SIGNED TX:", message.signedTx);
                            reactiveWc.instance.approveRequest({
                                id: callRequest.id,
                                result: JSON.stringify(message.signedTx),
                            });
                        } else if (message.isOrderApproved) {
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

    wcState$.subscribe(() => {
    });

    // TODO: implement as a single pipeline
    wcConnectActionsFromUi$.subscribe(() => {
    });

    walletConnectMessageProcessingPipeline$.subscribe((data: any) => {
        const {port, message} = data;
        console.log(port, message);
    });
}
