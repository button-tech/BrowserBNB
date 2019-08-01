import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../../../../services/storage.service';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-memo-input',
    templateUrl: './memo-input.component.html',
    styleUrls: ['./memo-input.component.css']
})
export class MemoInputComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    save(memo: string): void {
        // this.storage.currentTransaction.Memo = memo;
    }

    memoFormControl = new FormControl('', []);
}
