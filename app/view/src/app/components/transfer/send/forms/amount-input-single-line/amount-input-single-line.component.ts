import {
    Component,
    ElementRef, forwardRef,
    Input,
    Output,
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
export class AmountInputSingleLineComponent implements ControlValueAccessor {

    @Input()
    coin: string;

    value: number;

    onChange: (x: any) => void;
    onTouched: () => void;
    disabled: boolean;

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
}
