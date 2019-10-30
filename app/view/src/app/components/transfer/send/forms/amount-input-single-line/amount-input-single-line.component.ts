import {
    Component,
    forwardRef,
    Input, OnChanges,
    SimpleChange, SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

type InputMode = 'fiat' | 'crypto' | 'onlyCrypto';

function convert(src: number, rate2usd: number, inputMode: InputMode): number | string {

    if (inputMode === 'onlyCrypto' || isNaN(rate2usd)) {
        return 'N/A';
    }

    if (inputMode === 'crypto') {
        return src * rate2usd;
    }

    if (inputMode === 'fiat') {
        return src / rate2usd;
    }

    return 'N/A';
}

@Component({
    selector: 'app-amount-input-single-line',
    templateUrl: './amount-input-single-line.component.html',
    styleUrls: ['./amount-input-single-line.component.css'],
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

    value = 0;
    onChange: (x: any) => void;
    onTouched: () => void;

    // disabled: boolean;

    inputMode: InputMode = 'onlyCrypto';

    convertedAmount: number | string = 0;

    constructor() {
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
        // this.onChange = (userInput: string) => {
        //     // this.value = userInput;
        //     this.convertedAmount = convert(+userInput, this.rate2usd, this.inputMode);
        //     fn(userInput);
        // };
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        // this.disabled = isDisabled;
    }

    writeValue(value: number): void {
        // debugger
        this.value = value ? +value : 0;
    }

    switchInputMode() {
        if (this.inputMode === 'onlyCrypto') {
            return; // Can't sw
        }

        this.inputMode = (this.inputMode === 'crypto') ? 'fiat' : 'crypto';
        this.convertedAmount = convert(this.value, this.rate2usd, this.inputMode);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const rate2usd: SimpleChange = changes.rate2usd;
        if (!rate2usd) {
            return;
        }

        if (isNaN(rate2usd.currentValue)) {
            this.inputMode = 'onlyCrypto';
        } else if (isNaN(rate2usd.previousValue)) {
            this.inputMode = 'crypto';
        }
    }

    convert(): void {

        const hasRate = !isNaN(this.rate2usd);
        if (hasRate) {
            if (this.inputMode === 'crypto') {
                this.convertedAmount = this.value * this.rate2usd;
                return;
            } else if (this.inputMode === 'fiat') {
                this.convertedAmount = this.value / this.rate2usd;
                return;
            }
        }

        this.convertedAmount = 'N/A';

        // if (this.inputMode === 'onlyCrypto' || isNaN(this.rate2usd)) {
        //     this.convertedAmount = 'N/A';
        // } else if (this.inputMode === 'crypto') {
        //     this.convertedAmount = this.value * this.rate2usd;
        // } else if (this.inputMode === 'fiat') {
        //     this.convertedAmount = this.value / this.rate2usd;
        // }

        // return 'N/A';
    }
}
