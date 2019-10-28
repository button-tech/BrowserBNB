import {
    Component,
    ElementRef,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {BehaviorSubject} from "rxjs";

interface IAmounts {
    baseSymbol: string;
    secondarySymbol: string;
    calculatedSum: number;
    rate2usd: number;
}

@Component({
    selector: 'app-amount-input-single-line',
    templateUrl: './amount-input-single-line.component.html',
    styleUrls: ['./amount-input-single-line.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AmountInputSingleLineComponent {

    @Input()
    selectedToken: string;

    @Input()
    max: number;

    @Output()
    value: number;

    constructor() {
    }
}
