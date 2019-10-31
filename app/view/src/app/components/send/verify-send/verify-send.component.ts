import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-verify-send',
    templateUrl: './verify-send.component.html',
    styleUrls: ['./verify-send.component.css']
})
export class VerifySendComponent {

    @Output()
    verified = new EventEmitter<boolean>();

    @Output()
    rejected = new EventEmitter<boolean>();

    @Input()
    amount: number;

    @Input()
    selectedToken: string;

    @Input()
    bnbTransferFee: number;

    @Input()
    bnbTransferFeeFiat: number;

    @Input()
    rate2usd: number;

    get hasRate2usd(): boolean {
        return !isNaN(this.rate2usd);
    }

    get IsBnb(): boolean {
        return this.selectedToken === 'BNB';
    }
}
