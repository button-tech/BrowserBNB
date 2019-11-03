import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, pipe, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {ClipboardService} from '../../services/clipboard.service';
import {IUiState, StateService} from '../../services/state.service';
import {IBalance} from "../../services/binance.service";
import {ActivatedRoute} from "@angular/router";
import {ChromeApiWalletConnectService, IWcState} from "../../services/chrome-api-wc.service";
import {CosmosService} from "../../services/cosmos.service";
import {BlockchainType} from "../../services/storage.service";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {


    coin$: Observable<number>;
    coinInUsd$: Observable<number>;
    address$: Observable<string>;
    shortAddress$: Observable<string>;
    accountName$: Observable<string>;
    allBalances$: Observable<any>;
    copyMessage = 'Copy to clipboard';

    // @ts-ignore
    @ViewChild('alphaAlert')
    alphaAlert: ElementRef;

    walletConnected = false;
    walletConnectMessage$: Observable<string>;

    // wcPort: any; // Port

    sessionRequest: any;
    showApprove: boolean;

    callRequest: any;
    showCallRequest: boolean;

    // selectedBlockchain$: Observable<string>;
    //
    // sessionRequest: any = JSON.parse('{"id":1568231137072078,"jsonrpc":"2.0","method":"session_request","params":[{"peerId":"442662df-5f27-4555-9014-d6b4de5b027d","peerMeta":{"description":"","url":"https://www.binance.org","icons":["https://dex-bin.bnbstatic.com/0ec4e7a/favicon.png","https://dex-bin.bnbstatic.com/0ec4e7a/favicon.png"],"name":"Binance | Dex Trading | Decentralized Exchange | Binance.org"},"chainId":null}]}');
    //
    // callRequest: any = JSON.parse('{"id":1,"jsonrpc":"2.0","method":"bnb_sign","params":[{"account_number":"260658", "chain_id":"Binance-Chain-Tigris","data":null,"memo":"","msgs":[{"id":"8BCB4071024E9B57F8F79ACB81E4195BB1F6066A-2","ordertype":2,"price":169607,"quantity":5800000000,"sender":"bnb13095qugzf6d4078hnt9creqetwclvpn2htdccj","side":1,"symbol":"PYN-C37_BNB","timeinforce":1}],"sequence":"1","source":"0"}]}');
    //

    // isCosmos = false;
    // isCosmosSubscription: Subscription;
    // isCosmos$: Observable<boolean>;
    wcApiSubscription: Subscription;

    // wcMessagesSubscription: Subscription;

    constructor(activateRoute: ActivatedRoute,
                public stateService: StateService,
                private http: HttpClient,
                private clipboardService: ClipboardService,
                private wcApi: ChromeApiWalletConnectService,
                private cosmosService: CosmosService
    ) {
        // this.isCosmos$ = stateService.selectedBlockchain$.pipe(
        //     map((blockchain: BlockchainType) => {
        //         return blockchain === 'cosmos';
        //     })
        // );
        // .subscribe((isCosmos: boolean) => {
        //     this.isCosmos = isCosmos;
        // });

        this.accountName$ = this.stateService.uiState$.pipe(
            map((uiState: IUiState) => {
                return uiState.currentAccount.name;
            })
        );

        // this.selectedBlockchain$ = this.stateService.uiState$.pipe(
        //     map( (ui: IUiState) => {
        //         return ui.storageData.selectedBlockchain;
        //     }),
        // );

        this.address$ = this.stateService.currentAddress$;
        this.shortAddress$ = this.stateService.currentAddressShort$;
        this.coin$ = this.stateService.bnbBalance$;
        this.coinInUsd$ = this.stateService.bnbBalanceInFiat$;

        this.allBalances$ = this.stateService.allBalances$.pipe(
            map((balances: IBalance[]) => {
                return balances.length > 1;
            })
        );

        // const stub: Observable<IWcState> = of({
        //     wcPort: true, // Port
        //     walletConnected: true,
        //     sessionRequest: null, // JsonRpc format
        //     callRequest: null // JsonRpc format
        // });

        this.wcApiSubscription = this.wcApi.walletConnectState$
            .subscribe((wcState: IWcState) => {

                console.warn(wcState);
                if (!wcState) {
                    console.error('!wcState');
                    return;
                }

                this.sessionRequest = wcState.sessionRequest;
                this.showApprove = !!this.sessionRequest;

                this.callRequest = wcState.callRequest;
                this.showCallRequest = !!this.callRequest;

                this.walletConnected = wcState.walletConnected;
                this.walletConnectMessage$ =
                    setInfoForWcButton(this.stateService.uiState$, this.walletConnected);

            });

        //
        // this.wcApiSubscription = this.wcApi.connectedPort$.subscribe((port: Port) => {
        //     if (!port) {
        //         // TODO: handle that situation properly
        //         return;
        //     }
        //
        //     this.wcPort = port;
        //     console.log(`this.wcPort=${this.wcPort}`);
        // });

        //
        // this.wcMessagesSubscription = this.wcApi.connectedPortMessages$.subscribe((msg: any) => {
        //
        //       const {sessionRequest, callRequest, isWcConnected} = msg;
        //       if (sessionRequest) {
        //           this.sessionRequest = sessionRequest;
        //           this.showApprove = true;
        //       } else if (callRequest) {
        //           this.callRequest = callRequest;
        //           this.showCallRequest = true;
        //       } else if (isWcConnected !== undefined) {
        //           console.log("isWcConnected=", isWcConnected);
        //           this.walletConnected = isWcConnected;
        //           this.walletConnectMessage = isWcConnected
        //             ? 'Disconnect from DEX'
        //             : 'Connect to Binance DEX';
        //       }
        //   });
    }

    ngOnInit() {
        const resultAlert = localStorage.getItem('alert');
        if (resultAlert && resultAlert === 'yes' && this.alphaAlert) {
            this.alphaAlert.nativeElement.style.display = 'none';
        }
    }

    ngOnDestroy(): void {
        this.wcApiSubscription.unsubscribe();
    }

    copyAddress() {
        const currentAddress = this.stateService.currentAddress;
        this.clipboardService.copyToClipboard(currentAddress);
        this.copyMessage = 'Copied ✔';
    }

    closeAlphaAlert() {
        this.alphaAlert.nativeElement.style.display = 'none';
        localStorage.setItem('alert', 'yes');
    }

    connect() {
        window.open('https://www.binance.org/en/unlock', '_blank');
        // https://www.binance.org/en/unlock
        // this.wcApi.connect();
    }

    switchBlockchain() {
        this.stateService.switchBlockchain();
    }

    send(): void {
        // combineLatest([   this.stateService.currentAddress$, this.stateService.uiState$]).pipe(
        //     map( (x: any[]) => {
        //         const [addr, state] = x;
        //         console.log(10000, 'cosmos1et7a8svmxfkz23mn280k34q6upj36d7lggflpa', addr, state.storageData.seedPhrase, 0)
        //         this.cosmosService.sendTransaction(10000, 'cosmos1et7a8svmxfkz23mn280k34q6upj36d7lggflpa', addr, state.storageData.seedPhrase, 0);
        //     })
        // ).subscribe();
    }


    disconnect() {
        this.wcApi.disconnect();
    }

    approveWalletConnectSession(isApproved: boolean) {
        this.wcApi.approveWalletConnectSession(isApproved);
    }

    approveOrder(isApproved: boolean) {
        this.wcApi.approveOrder(isApproved);
    }

    connectTrustPlatform() {
        window.open('http://localhost:4201', '_blank');
    }
}

function setInfoForWcButton(blockchain: BehaviorSubject<IUiState>, isConnected: boolean): Observable<string> {

    return blockchain.pipe(
        map((state) => {
            const selectedBlockchain = state.storageData.selectedBlockchain;

            if (selectedBlockchain === 'binance') {
                return isConnected ? 'Disconnect from DEX' : 'Connect to Binance DEX';
            }

            if (selectedBlockchain === 'cosmos') {
                return isConnected ? 'Disconnect from Platform' : 'Connect to Platform';
            }
        })
    );

}
