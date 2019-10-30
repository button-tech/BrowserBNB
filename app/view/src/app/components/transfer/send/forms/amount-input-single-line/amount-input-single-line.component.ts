import {
    Component,
    ElementRef, forwardRef,
    Input, OnChanges,
    Output, SimpleChange, SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'app-amount-input-single-line',
    templateUrl: './amount-input-single-line.component.html',
    styleUrls: ['./amount-input-single-line.component.css'],
    // encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AmountInputSingleLineComponent),
            multi: true
        }
    ]
})
export class AmountInputSingleLineComponent implements ControlValueAccessor, OnChanges {

    @Input()
    coin: string;

    @Input()
    rate2usd = NaN;

    value: number;
    onChange: (x: any) => void;
    onTouched: () => void;
    disabled: boolean;

    inputMode: 'fiat' | 'crypto' | 'onlyCrypto' = 'onlyCrypto';

    calculatedAmount: number | string = 0;

    calculateAmount(): number | string {
        console.log(this.value);
        if (this.inputMode === 'onlyCrypto')  {
            return 'N/A';
        }

        if (this.inputMode === 'crypto') {
            return this.value * this.rate2usd;
        }

        if (this.inputMode === 'fiat') {
            return this.value / this.rate2usd;
        }
    }

    constructor() {
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(value: number): void {
        this.value = value ? +value : 0;
    }

    switchInputMode() {
        if (this.inputMode === 'onlyCrypto') {
            return; // Do nothing
        }
        this.inputMode = (this.inputMode === 'crypto') ? 'fiat' : 'crypto';
    }

    ngOnChanges(changes: SimpleChanges): void {
        const rate2usd: SimpleChange = changes.rate2usd;
        if (!rate2usd) {
            return; // Don't react on coin change
        }

        if (isNaN(rate2usd.currentValue)) {
            this.inputMode = 'onlyCrypto';
        } else if (isNaN(rate2usd.previousValue)) {
            this.inputMode = 'crypto';
        }
    }
}
