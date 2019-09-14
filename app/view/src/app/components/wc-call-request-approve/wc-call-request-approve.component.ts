import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-wc-call-request-approve',
    templateUrl: './wc-call-request-approve.component.html',
    styleUrls: ['./wc-call-request-approve.component.css']
})
export class WcCallRequestApproveComponent implements OnInit, OnChanges {

    @Output()
    isApproved = new EventEmitter<boolean>();

    @Input()
    callRequest: any;

    price: string;
    quantity: string;
    ordertype: string;
    symbol: string;
    chain_id: string;

    constructor() {
    }

    ngOnInit() {
        //
    }

    approve(value: boolean) {
        this.isApproved.next(value);
    }

    ngOnChanges(changes: SimpleChanges): void {

        const jsonRpc = changes.callRequest.currentValue;

        const {chain_id} = jsonRpc.params[0];
        const {price, quantity, ordertype, symbol} = jsonRpc.params[0].msgs[0];

        this.chain_id = chain_id;
        this.price = price;
        this.quantity = quantity;
        if (ordertype === '2') {
            this.ordertype = 'buy';
        }  else {
            this.ordertype = 'sell';
        }
        this.symbol = symbol;
    }

    Number( quantity: string ): number {
        return Number(quantity);
    }
}
