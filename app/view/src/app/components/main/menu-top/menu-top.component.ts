import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {CurrentAccountService} from "../../../services/current-account.service";
import {IAccount, IMenuItem, StorageService} from "../../../services/storage.service";
import {AuthService} from "../../../services/auth.service";
import {map, take} from "rxjs/operators";


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
    userItems: IMenuItem[] = [];
    constructor(public currentAccount: CurrentAccountService,
                public storage: StorageService,
                private authService: AuthService,
    ) {
        this.selectedNetwork$ = this.storage.selectedNetwork$;
        this.networkMenu = this.storage.networkMenu;
    }

    rename(name: any, index: number) {

    }


    selectNetwork(value: IMenuItem) {

    }

    selectUser(value: string) {

    }


    logout() {
        this.authService.logout();
    }
}
