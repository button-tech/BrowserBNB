import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {AlertsService} from "../../../../services/alerts.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    constructor(private location: Location, public alert: AlertsService, private router: Router) {
    }

    ngOnInit() {
    }

    goBack() {
        this.location.back();
    }

    showInfo() {
        this.alert.showError('Not ready', 'Will be soon');
    }

    navigate(path: string) {
        this.router.navigate(['/' + path]);
    }
}
