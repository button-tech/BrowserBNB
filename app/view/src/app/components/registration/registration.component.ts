import {Component} from '@angular/core';
import {Location} from '@angular/common'

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

    constructor(private location: Location) {
    }

    goBack() {
        this.location.back();
    }

}
