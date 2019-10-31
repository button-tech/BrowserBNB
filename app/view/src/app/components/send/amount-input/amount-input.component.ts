import {
    Component,
    forwardRef,
    Input, OnChanges,
    SimpleChange, SimpleChanges,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

export type InputMode = 'fiat' | 'crypto' | 'onlyCrypto';

@Component({
    selector: 'app-amount-input',
    templateUrl: './amount-input.component.html',
    styleUrls: ['./amount-input.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AmountInputComponent),
            multi: true
        }
    ]
})
export class AmountInputComponent implements ControlValueAccessor, OnChanges {

    @Input()
    coin: string;

    @Input()
    rate2usd = NaN;

    @Input()
    inputMode: InputMode = 'onlyCrypto';

    value = 0;
    onChange: () => void;
    onTouched: () => void;

    // disabled: boolean;

    convertedAmount: number | string = 0;

    constructor() {
    }

    registerOnChange(fn: any): void {
        this.onChange = () => {
            const valueInCrypto = this.inputMode === 'fiat' ? this.convertedAmount : this.value;
            fn(valueInCrypto);
        };
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        // this.disabled = isDisabled;
    }

    writeValue(value: number): void {
        this.value = value ? +value : 0;
        this.updateConverted();
    }

    switchInputMode() {
        if (this.inputMode === 'onlyCrypto') {
            return; // Can't sw
        }

        this.inputMode = (this.inputMode === 'crypto') ? 'fiat' : 'crypto';
        this.updateConverted();
    }

    ngOnChanges(changes: SimpleChanges): void {

        const rate2usd: SimpleChange = changes.rate2usd;
        if (!rate2usd) {
            return;
        }

        if (isNaN(rate2usd.currentValue)) {
            this.inputMode = 'onlyCrypto'; // Reset to only crypto input mode
        } else if (isNaN(rate2usd.previousValue)) {
            // We didn't have rate before, and now we have.
            // Let's stay in crypto but with ability to change input mode to fiat
            this.inputMode = 'crypto';
        }
        this.updateConverted();
    }

    updateConverted(): void {

        const hasRate = !isNaN(this.rate2usd);
        if (hasRate) {
            if (this.inputMode === 'crypto') {
                this.convertedAmount = (this.value * this.rate2usd).toFixed(2);
                return;
            } else if (this.inputMode === 'fiat') {
                // TODO: put 4 or other number to constant (it is used in other places as well)
                this.convertedAmount = (this.value / this.rate2usd).toFixed(4);
                return;
            }
        }

        this.convertedAmount = 'N/A';
    }
}
