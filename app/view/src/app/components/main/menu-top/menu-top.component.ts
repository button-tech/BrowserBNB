import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {IMenuItem, StorageService} from "../../../services/storage.service";
import {AuthService} from "../../../services/auth.service";
import {map} from "rxjs/operators";


@Component({
    selector: 'app-menu-top',
    templateUrl: './menu-top.component.html',
    styleUrls: ['./menu-top.component.css']
})
export class MenuTopComponent {
    constructor() {
    }
}
