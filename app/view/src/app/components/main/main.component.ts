import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ClipboardService } from '../../services/clipboard.service';
import { IUiState, StateService } from '../../services/state.service';
import { IBalance } from "../../services/binance.service";
import { ActivatedRoute, Router } from "@angular/router";

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

    // @ts-ignore
    @ViewChild('alphaAlert')
    alphaAlert: ElementRef;
    showApprove: boolean;

    wcPort: any; // Port

    sessionRequest: any;

    // sessionRequest: any = JSON.parse('{"id":1568231137072078,"jsonrpc":"2.0","method":"session_request","params":[{"peerId":"442662df-5f27-4555-9014-d6b4de5b027d","peerMeta":{"description":"","url":"https://www.binance.org","icons":["https://dex-bin.bnbstatic.com/0ec4e7a/favicon.png","https://dex-bin.bnbstatic.com/0ec4e7a/favicon.png"],"name":"Binance | Dex Trading | Decentralized Exchange | Binance.org"},"chainId":null}]}');

    constructor(activateRoute: ActivatedRoute,
                public stateService: StateService,
                private http: HttpClient,
                private router: Router,
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
              return balances.length > 0;
          })
        );
    }

    ngOnInit() {
        const resultAlert = localStorage.getItem('alert');
        if (resultAlert && resultAlert === 'yes' && this.alphaAlert) {
            this.alphaAlert.nativeElement.style.display = 'none';
        }

        // port-wallet-connect
        this.wcPort = chrome.runtime.connect({
            name: 'port-wallet-connect'
        });

        console.log('connected, port-wallet-connect');
        this.wcPort.onMessage.addListener((msg: any) => {
            console.log('1');
            console.log('msg=', msg);
            this.sessionRequest = msg.sessionRequest;
            this.showApprove = true;
            console.log('2');
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

    approveWalletConnectSession(isApproved: boolean) {
        this.showApprove = false;
        this.wcPort.postMessage({
            isApproved,
            bnbAddress: this.stateService.currentAddress
        });
    }
}
