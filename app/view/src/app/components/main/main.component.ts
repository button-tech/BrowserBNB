import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ClipboardService} from '../../services/clipboard.service';
import {IUiState, StateService} from '../../services/state.service';
import {IBalance} from "../../services/binance.service";
import { ActivatedRoute } from "@angular/router";

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
        this.bnbInUsd$ = this.stateService.bnbBalanceInUsd$;
        this.allBalances$ = this.stateService.allBalances$.pipe(
            map((balances: IBalance[]) => {
                return balances.length > 0;
            })
        );
    }

    ngOnInit() {
        const resultAlert = localStorage.getItem('alert');
        if (resultAlert && resultAlert === 'yes' &&  this.alphaAlert) {
            this.alphaAlert.nativeElement.style.display = 'none';
        }
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
}
