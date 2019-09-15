import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { environment } from "../../environments/environment";
import { BehaviorSubject, Observable, Subject, timer } from "rxjs";
import { distinctUntilChanged, filter, map, switchMap, tap } from "rxjs/operators";
import { PortAndMessage } from "../../../../background/src/backgroud-common";
import { StateService } from "./state.service";
import Port = chrome.runtime.Port;

const portStub = {
    onMessage: {
        addListener: () => {
        }
    },
    postMessage: (x: any) => {
    }
};

export function fromMessages(port: Port): Observable<PortAndMessage> {
    const subject = new Subject<PortAndMessage>();
    port.onMessage.addListener((message: any) => {
        subject.next({port, message});
    });

    return subject.asObservable();
}

export interface IWcState {
    wcPort: any; // Port
    walletConnected: boolean;
    sessionRequest: any; // JsonRpc format
    callRequest: any; // JsonRpc format
}

@Injectable()
export class ChromeApiWalletConnectService {

    // private _connectedPort$ = new BehaviorSubject<any>(null);
    // connectedPort$: Observable<Port> = this._connectedPort$.asObservable();
    // connectedPortMessages$: Observable<any>;

    port: Port;
    msg: any;
    msgFromBackground$: Observable<any>;

    private _walletConnectState$ = new BehaviorSubject<IWcState>({
        wcPort: null,
        walletConnected: false,
        sessionRequest: null,
        callRequest: null,
    });

    walletConnectState$: Observable<IWcState> = this._walletConnectState$.asObservable();

    constructor(private authService: AuthService, private stateService: StateService) {

        authService.isLoggedIn$.pipe(
          map((isLoggedIn: boolean) => {

              if (!isLoggedIn) {
                  return;
              }

              return environment.production
                ? chrome.runtime.connect({name: 'port-wallet-connect'})
                : portStub;
          }),
          switchMap((port: Port) => {
              return fromMessages(port);
          }),
          tap((x: any) => {
              const {port, message} = x;
              this.port = port;
              this.msg = message;
          }),
        ).subscribe(() => {});

        // All this construction is a fix on ui locks when getting message from backgorund

        timer(0, 100).pipe(
          map(() => this.msg),
          filter((msg) => !!msg),
          distinctUntilChanged(),
          map((x: PortAndMessage) => {
              const {port, message} = x;

              console.warn(`MESSAGE FROM WC PORT: ${JSON.stringify(message)}`);

              let update = {};
              const {sessionRequest, callRequest, isWcConnected} = message;
              if (sessionRequest) {
                  update = {sessionRequest};
              } else if (callRequest) {
                  update = {callRequest};
              } else if (isWcConnected !== undefined) {
                  // TODO: align naming
                  update = {walletConnected: isWcConnected};
              }

              const prevState = this._walletConnectState$.getValue();
              return {
                  ...prevState,
                  ...update,
                  wcPort: port
              };
          }),
        ).subscribe((newState: IWcState) => {
            // Here we aggregate latest state - like shareReplay(1)
            this._walletConnectState$.next(newState);
        });
    }

    connect() {
        // console.log('Connect clicked');
        const state = this._walletConnectState$.getValue();
        state.wcPort.postMessage({
            updateConnectionState: true,
            newState: true
        });
    }

    disconnect() {
        const state = this._walletConnectState$.getValue();
        state.wcPort.postMessage({
            updateConnectionState: true,
            newState: false
        });
    }

    approveWalletConnectSession(isApproved: boolean) {

        const prevState = this._walletConnectState$.getValue();

        prevState.wcPort.postMessage({
            isApproved,
            privateKey: this.stateService.uiState.currentAccount.privateKey,
            bnbAddress: this.stateService.currentAddress
        });

        this._walletConnectState$.next({
            ...prevState,
            sessionRequest: null
        });
    }

    approveOrder(isApproved: boolean) {
        const prevState = this._walletConnectState$.getValue();
        prevState.wcPort.postMessage({
            orderApproveResponse: true,
            isOrderApproved: isApproved
        });

        this._walletConnectState$.next({
            ...prevState,
            callRequest: null
        });
    }
}



