import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-wc-session-approve',
    templateUrl: './wc-session-approve.component.html',
    styleUrls: ['./wc-session-approve.component.css']
})
export class WcSessionApproveComponent implements OnInit, OnChanges {

    @Output()
    isApproved = new EventEmitter<boolean>();

    @Input()
    sessionRequest: any;

    name: string;
    url: string;
    icon: string;

    constructor() {
    }

    ngOnInit() {
        //
    }

    approve(value: boolean) {
        this.isApproved.next(value);
    }

    ngOnChanges(changes: SimpleChanges): void {

        if (!changes || !changes.sessionRequest || !changes.sessionRequest.currentValue) {
            return;
        }

        const jsonRpc = changes.sessionRequest.currentValue;
        const {url, icons, name} = jsonRpc.params[0].peerMeta;

        this.url = url;
        this.name = name;
        this.icon = icons && icons[0];
    }

}
