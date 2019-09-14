import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ClipboardService } from '../../services/clipboard.service';
import { IUiState, StateService } from '../../services/state.service';
import { IBalance } from "../../services/binance.service";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../environments/environment";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

    bnb$: Observable<number>;
    bnbInUsd$: Observable<number>;
    address$: Observable<string>;
    shortAddress$: Observable<string>;
    accountName$: Observable<string>;
    allBalances$: Observable<any>;
    copyMessage = 'Copy to clipboard';
    walletConnected = false;
    walletConnectMessage = "Connect to Binance DEX";

    // @ts-ignore
    @ViewChild('alphaAlert')
    alphaAlert: ElementRef;


    wcPort: any; // Port

    sessionRequest: any;
    showApprove: boolean;

    callRequest: any;
    showCallRequest: boolean;

    // sessionRequest: any = JSON.parse('{"id":1568231137072078,"jsonrpc":"2.0","method":"session_request","params":[{"peerId":"442662df-5f27-4555-9014-d6b4de5b027d","peerMeta":{"description":"","url":"https://www.binance.org","icons":["https://dex-bin.bnbstatic.com/0ec4e7a/favicon.png","https://dex-bin.bnbstatic.com/0ec4e7a/favicon.png"],"name":"Binance | Dex Trading | Decentralized Exchange | Binance.org"},"chainId":null}]}');
    // callRequest: any = JSON.parse('{"id":1,"jsonrpc":"2.0","method":"bnb_sign","params":[{"account_number":"260658","chain_id":"Binance-Chain-Tigris","data":null,"memo":"","msgs":[{"id":"8BCB4071024E9B57F8F79ACB81E4195BB1F6066A-2","ordertype":2,"price":169607,"quantity":5800000000,"sender":"bnb13095qugzf6d4078hnt9creqetwclvpn2htdccj","side":1,"symbol":"PYN-C37_BNB","timeinforce":1}],"sequence":"1","source":"0"}]}');

    constructor(activateRoute: ActivatedRoute,
                public stateService: StateService,
                private http: HttpClient,
                private clipboardService: ClipboardService,
    ) {

        this.accountName$ = this.stateService.uiState$.pipe(
          map((uiState: IUiState) => {
              return uiState.currentAccount.name;
          })
        );
        this.address$ = this.stateService.currentAddress$;
        this.shortAddress$ = this.stateService.currentAddressShort$;
        this.bnb$ = this.stateService.bnbBalance$;
        this.bnbInUsd$ = this.stateService.bnbBalanceInFiat$;

        this.allBalances$ = this.stateService.allBalances$.pipe(
          map((balances: IBalance[]) => {
              return balances.length > 1;
          })
        );
    }

    ngOnInit() {
        const resultAlert = localStorage.getItem('alert');
        if (resultAlert && resultAlert === 'yes' && this.alphaAlert) {
            this.alphaAlert.nativeElement.style.display = 'none';
        }

        if (environment.production) {
            this.wcPort = chrome.runtime.connect({
                name: 'port-wallet-connect'
            });
        } else {
            this.wcPort = {
                onMessage: {
                    addListener: () => {
                    }
                },
                postMessage: (x: any) => {}
            };
        }

        console.log('connected, port-wallet-connect');
        this.wcPort.onMessage.addListener((msg: any) => {
            const {sessionRequest, callRequest, isWcConnected} = msg;
            if (sessionRequest) {
                this.sessionRequest = sessionRequest;
                this.showApprove = true;
            } else if (callRequest) {
                this.callRequest = callRequest;
                this.showCallRequest = true;
            } else if (isWcConnected !== undefined) {
                this.walletConnected = isWcConnected;
            }
        });
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
        this.wcPort.postMessage({
            updateConnectionState: true,
            newState: true
        });

        this.walletConnectMessage = 'Disconnect from DEX';
    }

    disconnect() {
        this.wcPort.postMessage({
            updateConnectionState: true,
            newState: false
        });

        this.walletConnectMessage = 'Connect to Binance DEX';
    }

    approveWalletConnectSession(isApproved: boolean) {
        this.showApprove = false;
        this.wcPort.postMessage({
            isApproved,
            privateKey: this.stateService.uiState.currentAccount.privateKey,
            bnbAddress: this.stateService.currentAddress
        });
    }

    approveOrder(isApproved: boolean) {
        this.showCallRequest = false;
        this.wcPort.postMessage({
            isOrderApproved: isApproved
        });
    }
}
