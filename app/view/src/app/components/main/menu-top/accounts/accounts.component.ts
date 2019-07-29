import {Component, OnInit} from '@angular/core';
import {map} from "rxjs/operators";
import {StorageService} from "../../../../services/storage.service";
import {AuthService} from "../../../../services/auth.service";

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

    constructor(public storage: StorageService,
                private authService: AuthService,) {
    }

    ngOnInit() {
    }

    toShortAddress(address) {
        return address.substring(0, 8) + '...' + address.substring(address.length - 8, address.length)
    }

    rename(name: any, index: number) {
        this.storage.storageData$.pipe(
            map((x) => {
                x.AccountList[index].accountName = name;
                this.storage.updateStorage(x);
            }),
        ).subscribe();

    }

    selectUser(value: string) {
        // this.currentAccount.accountName = value;
    }


    logout() {
        this.authService.logout();
    }

}
