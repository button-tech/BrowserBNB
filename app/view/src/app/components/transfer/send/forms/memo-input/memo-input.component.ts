import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {StateService} from "../../../../../services/state.service";

@Component({
    selector: 'app-memo-input',
    templateUrl: './memo-input.component.html',
    styleUrls: ['./memo-input.component.css']
})
export class MemoInputComponent implements OnInit {

    constructor(private stateService: StateService) {
    }

    memoFormControl = new FormControl('', []);

    ngOnInit() {
    }

    save(memo: string): void {
        const nexTx = this.stateService.currentTransaction.getValue();
        nexTx.Memo = memo;
        this.stateService.currentTransaction.next(nexTx);
    }
}
