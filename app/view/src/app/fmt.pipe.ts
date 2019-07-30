import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'fmtPipe',
    pure: true
})
export class FmtPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        const symbol = args[0] || '';

        if (value === null) {
            return 'pending';
        } else if (symbol === 'USD') {
            return `$ ${value} USD`;
        }
        return `${value} ${symbol}`;
    }

}
