import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../../../../services/storage.service';
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

    ngOnInit() {
    }

    save(memo: string): void {
        const nexTx = this.stateService.currentTransaction.getValue();
        nexTx.Memo = memo;
        this.stateService.currentTransaction.next(nexTx);
    }

    memoFormControl = new FormControl('', []);
}
