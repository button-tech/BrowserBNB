import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {AlertsService} from "../../../../services/alerts.service";
import {Router} from "@angular/router";
import {ChromeApiService} from "../../../../services/chrome-api.service";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    constructor(private location: Location,
                public alert: AlertsService,
                private router: Router,
                private chrome: ChromeApiService) {
    }

    ngOnInit() {
    }

    goBack() {
        this.location.back();
    }

    sendToFeedBack() {
        this.chrome.openNewTab(`https://forms.gle/nQ3atMNb9AZtZmPB9`);
    }

    showInfo() {
        this.alert.showError('Not ready', 'Will be soon');
    }

    navigate(path: string) {
        this.router.navigate(['/' + path]);
    }
}
