import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ITokenInfo, StateService} from '../../../../../services/state.service';
import {Observable, Subscription} from 'rxjs';
import {distinctUntilChanged, map} from "rxjs/operators";


@Component({
    selector: 'app-coins-select',
    templateUrl: './coins-select.component.html',
    styleUrls: ['./coins-select.component.css']
})
export class CoinsSelectComponent {

    @Input() network: string;
    @Output() coin = new EventEmitter<string>();

    tokens$: Observable<ITokenInfo[]> = this.stateService.tokens$;
    selectedCoin: string;

    constructor(public stateService: StateService) {
    }
}
