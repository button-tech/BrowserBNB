import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ClipboardService} from '../../services/clipboard.service';
import {IUiState, StateService} from '../../services/state.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent {

    bnb$: Observable<number>;
    bnbInUsd$: Observable<number>;
    address$: Observable<string>;
    shortAddress$: Observable<string>;
    accountName$: Observable<string>;
    copyMessage = 'Copy to clipboard';

    constructor(public stateService: StateService,
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
    }

    copyAddress() {
        const currentAddress = this.stateService.currentAddress;
        this.clipboardService.copyToClipboard(currentAddress);
        this.copyMessage = 'Copied ✔';
    }
}
