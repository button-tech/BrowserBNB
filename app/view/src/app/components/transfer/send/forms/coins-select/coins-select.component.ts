import {Component, EventEmitter, Output} from '@angular/core';
import {IMenuItem, ITokenInfo, StateService} from '../../../../../services/state.service';
import {Observable, Subscription} from 'rxjs';

@Component({
    selector: 'app-coins-select',
    templateUrl: './coins-select.component.html',
    styleUrls: ['./coins-select.component.css']
})
export class CoinsSelectComponent {

    selectedToken = 'BNB';

    @Output()
    coinSelected = new EventEmitter<string>();

    tokens$: Observable<ITokenInfo[]> = this.stateService.tokens$;
    selectedNetwork$: Observable<IMenuItem> = this.stateService.selectedNetwork$;

    constructor(public stateService: StateService) {
        // const network = this.stateService.network;
    }

    onCoinChange(x: any) {
        debugger
        this.coinSelected.next(x);
    }
}
