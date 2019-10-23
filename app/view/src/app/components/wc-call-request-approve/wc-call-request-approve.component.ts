import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

// TODO: move to wallet-connect module folder & module
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
    side: number;

    constructor() {
    }

    ngOnInit() {
        //
    }

    approve(value: boolean) {
        this.isApproved.next(value);
    }

    ngOnChanges(changes: SimpleChanges): void {

        if (!changes || !changes.callRequest || !changes.callRequest.currentValue) {
            return;
        }

        const jsonRpc = changes.callRequest.currentValue;

        if (!jsonRpc.params[0]) {
            this.price = '';
            this.quantity = '';
            this.ordertype = '';
            this.symbol = '';
            this.chain_id = '';
            this.side = 0;
        }

        const {chain_id} = jsonRpc.params[0];
        const {price, quantity, ordertype, symbol, side} = jsonRpc.params[0].msgs[0];

        // console.log("side");
        // console.log(side);

        this.chain_id = chain_id;
        this.price = price;
        this.quantity = quantity;
        if (ordertype === '2') {
            this.ordertype = 'buy';
        } else {
            this.ordertype = 'sell';
        }
        this.symbol = symbol;
        this.side = side;
    }

    Number(quantity: string): number {
        return Number(quantity);
    }
}
