import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {AlertsService} from "../../../../services/alerts.service";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    constructor(private location: Location, public alert: AlertsService) {
    }

    ngOnInit() {
    }

    goBack() {
        this.location.back();
    }
    showInfo() {
        this.alert.showError('Not ready', 'Will be soon');
    }

}
