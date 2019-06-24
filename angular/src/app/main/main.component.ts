import {Component, OnInit} from '@angular/core';
import {MemoryService} from "../services/memory.service";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    address: string;
    shortAddress: string;

    constructor(private memory: MemoryService) {
    }

    ngOnInit() {
        this.memory.currentAddress.subscribe(address => this.address = address)
        this.shortAddress = this.address.substring(0, 5) + '...' + this.address.substring(this.address.length - 6, this.address.length);
    }

}
