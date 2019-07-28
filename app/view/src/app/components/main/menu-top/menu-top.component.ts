import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CurrentAccountService} from '../../../services/current-account.service';
import {StorageService} from '../../../services/storage.service';
import {AuthService} from '../../../services/auth.service';
import {IMenuItem} from '../../../services/state.service';


@Component({
    selector: 'app-menu-top',
    templateUrl: './menu-top.component.html',
    styleUrls: ['./menu-top.component.css']
})
export class MenuTopComponent implements OnDestroy {


    // @ts-ignore
    @ViewChild('menuNetwork')
    menuNetwork: ElementRef;


    AccountList: [];

    networkMenu: IMenuItem[];
    selectedNetwork$: BehaviorSubject<IMenuItem>;
    userItems: IMenuItem[] = [];

    constructor(public currentAccount: CurrentAccountService,
                public storage: StorageService,
                private authService: AuthService,
    ) {
        // this.selectedNetwork$ = this.storage.selectedNetwork$;
        // this.networkMenu = this.storage.networkMenu;
    }

    toShortAddress(address) {
        return address.substring(0, 8) + '...' + address.substring(address.length - 8, address.length);
    }

    rename(name: any, index: number) {
        // console.log(index);
        // console.log(name)''
        // this.storage.storageData$.pipe(
        //     map((x) => {
        //         x.AccountList[index].accountName = name;
        //         this.storage.updateStorage(x);
        //     }),
        // ).subscribe();
    }


    selectNetwork(value: IMenuItem) {
        // this.storage.selectedNetwork$.next(value);
    }

    selectUser(value: string) {
        // this.currentAccount.accountName = value;
    }


    logout() {
        this.authService.logout();
    }

    ngOnDestroy(): void {

    }

}
