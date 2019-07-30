import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {StateService} from '../../../../../services/state.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-coins-select',
    templateUrl: './coins-select.component.html',
    styleUrls: ['./coins-select.component.css']
})
export class CoinsSelectComponent implements OnInit {

    bnb$: Observable<number>;
    chosenCurrency: string;
    heroForm: FormGroup;

    constructor(private fb: FormBuilder, public stateService: StateService,) {
        this.bnb$ = this.stateService.bnbBalance$;
    }

    ngOnInit() {
        this.heroForm = this.fb.group({
            heroId: 'BNB',
            agree: null
        });
    }
}
