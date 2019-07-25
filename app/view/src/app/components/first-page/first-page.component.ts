import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from '../../services/storage.service';

@Component({
    selector: 'app-greeter',
    templateUrl: './first-page.component.html',
    styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent {

    constructor(private router: Router, public storage: StorageService) {

    }

}
