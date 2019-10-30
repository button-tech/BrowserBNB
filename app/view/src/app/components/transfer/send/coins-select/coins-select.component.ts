import {Component, EventEmitter, Output} from '@angular/core';
import {INetworkMenuItem, ITokenInfo, StateService} from '../../../../services/state.service';
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
    selectedNetwork$: Observable<INetworkMenuItem> = this.stateService.selectedNetwork$;

    constructor(public stateService: StateService) {
    }

    onCoinChange(x: any) {
        this.coinSelected.next(x);
    }
}
