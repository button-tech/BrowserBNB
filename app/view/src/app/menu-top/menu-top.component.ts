import {Component, ElementRef, ViewChild} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {CurrentAccountService} from "../services/current-account.service";
import {IMenuItem, StorageService} from "../services/storage.service";
import {AuthService} from "../services/auth.service";


@Component({
    selector: 'app-menu-top',
    templateUrl: './menu-top.component.html',
    styleUrls: ['./menu-top.component.css']
})
export class MenuTopComponent {


    // @ts-ignore
    @ViewChild('menuNetwork')
    menuNetwork: ElementRef;

    networkMenu: IMenuItem[];
    selectedNetwork$: BehaviorSubject<IMenuItem>;


    constructor(public currentAccount: CurrentAccountService,
                public storage: StorageService,
                private authService: AuthService,
    ) {

        this.selectedNetwork$ = this.storage.selectedNetwork$;
        this.networkMenu = this.storage.networkMenu;
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

}
