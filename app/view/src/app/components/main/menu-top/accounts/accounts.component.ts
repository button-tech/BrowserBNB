import {Component, OnInit} from '@angular/core';
import {map, pluck} from 'rxjs/operators';
import {AuthService} from '../../../../services/auth.service';
import {IUiAccount, StateService} from '../../../../services/state.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.css']
})
export class AccountsComponent {

    accounts$: Observable<IUiAccount[]>;

    constructor(public stateService: StateService, private authService: AuthService) {
        this.accounts$ = stateService.uiState$.pipe(
            pluck('accounts')
        )
    }

    renameAccount(name: any, index: number): void {

    }

    switchAccount(value: string): void {

    }

    addAccount(): void {
        this.stateService.addAccount();
    }

    logout() {
        this.authService.logout();
    }

}
