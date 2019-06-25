import {Component, OnInit} from '@angular/core';
import {MemoryService} from '../services/memory.service';

@Component({
    selector: 'app-greeter',
    templateUrl: './greeter.component.html',
    styleUrls: ['./greeter.component.css']
})
export class GreeterComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }
}
