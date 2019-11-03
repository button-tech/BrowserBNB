import {Component, EventEmitter, Input, Output} from '@angular/core';
import {INetworkMenuItem, ITokenInfo, StateService} from '../../../services/state.service';
import {Observable, of, Subscription} from 'rxjs';
import {switchMap} from "rxjs/operators";

@Component({
    selector: 'app-coins-select',
    templateUrl: './coins-select.component.html',
    styleUrls: ['./coins-select.component.css']
})
export class CoinsSelectComponent {

    @Input()
    selectedToken = 'BNB';

    @Output()
    coinSelected = new EventEmitter<string>();

    tokens$: Observable<ITokenInfo[]> = this.stateService.tokens$;
    selectedNetwork$: Observable<INetworkMenuItem> = this.stateService.selectedNetwork$;

    constructor(public stateService: StateService) {
        // this.tokens$ = this.stateService.isCosmos$.pipe(
        //     switchMap((isCosmos: boolean) => {
        //         return isCosmos ? of([]) : this.stateService.tokens$;
        //     })
        // );
    }

    onCoinChange(x: any) {
        this.coinSelected.next(x);
    }
}
