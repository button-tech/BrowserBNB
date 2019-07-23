import {Component, ElementRef, ViewChild} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {CurrentAccountService} from "../services/current-account.service";
import {StorageService} from "../services/storage.service";
import {AuthService} from "../services/auth.service";
import {HttpClient} from "@angular/common/http";
import {ClipboardService} from "../services/clipboard.service";
import {BinanceService} from "../services/binance.service";


interface MenuItem {
    label: string;
    val: string;
}


@Component({
    selector: 'app-menu-top',
    templateUrl: './menu-top.component.html',
    styleUrls: ['./menu-top.component.css']
})
export class MenuTopComponent {


    // @ts-ignore
    @ViewChild('menuNetwork')
    menuNetwork: ElementRef;


    selectedNetwork$: BehaviorSubject<MenuItem>;

    networkMenu: MenuItem[];

    userItems: MenuItem[] = [];

    constructor(public currentAccount: CurrentAccountService,
                public storage: StorageService,
                private authService: AuthService,
                private http: HttpClient,
                private clipboardService: ClipboardService,
                private bncService: BinanceService
    ) {

        this.networkMenu = [
            {
                label: 'MAINNET',
                val: bncService.endpointList.MAINNET
            },
            {
                label: 'TESTNET',
                val: bncService.endpointList.TESTNET
            },
        ];

        this.selectedNetwork$ = new BehaviorSubject(this.networkMenu[0]);

        this.storage.storageData$.subscribe((x) => {
            this.userItems = x.AccountList.map((acc) => {
                return {
                    label: acc.accountName,
                    val: acc.accountName
                };
            });
        });

    }

    selectNetwork(value: MenuItem) {
        this.selectedNetwork$.next(value);
    }

    selectUser(value: string) {
        // this.currentAccount.accountName = value;
    }


    logout() {
        this.authService.logout();
    }

}
