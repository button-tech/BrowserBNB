import {Component, OnInit} from '@angular/core';
import {MemoryService} from "../services/memory.service";

@Component({
    selector: 'app-password-creation',
    templateUrl: './password-creation.component.html',
    styleUrls: ['./password-creation.component.css']
})
export class PasswordCreationComponent implements OnInit {

    address: string;

    constructor(private memory: MemoryService) {
    }

    ngOnInit() {
        this.memory.currentAddress.subscribe(address => this.address = address)
    }

}
