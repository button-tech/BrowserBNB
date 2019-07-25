import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {CurrentAccountService} from "../services/current-account.service";
import {IMenuItem, StorageService} from "../services/storage.service";
import {AuthService} from "../services/auth.service";


@Component({
    selector: 'app-menu-top',
    templateUrl: './menu-top.component.html',
    styleUrls: ['./menu-top.component.css']
})
export class MenuTopComponent implements OnDestroy{


    // @ts-ignore
    @ViewChild('menuNetwork')
    menuNetwork: ElementRef;

    networkMenu: IMenuItem[];
    selectedNetwork$: BehaviorSubject<IMenuItem>;
    userItems: IMenuItem[] = [];
    subscription: Subscription;

    constructor(public currentAccount: CurrentAccountService,
                public storage: StorageService,
                private authService: AuthService,
    ) {

        this.selectedNetwork$ = this.storage.selectedNetwork$;
        this.networkMenu = this.storage.networkMenu;
        this.subscription = this.storage.storageData$.subscribe((x) => {
            this.userItems = x.AccountList.map((acc) => {
                return {
                    label: acc.accountName,
                    val: acc.accountName,
                    networkPrefix: acc.accountName
                };
            });
        });
    }

    selectNetwork(value: IMenuItem) {
        this.storage.selectedNetwork$.next(value);
    }

    selectUser(value: string) {
        // this.currentAccount.accountName = value;
    }


    logout() {
        this.authService.logout();
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
