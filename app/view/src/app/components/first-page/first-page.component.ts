import {Component} from '@angular/core';
import {StorageService} from '../../services/storage.service';

@Component({
    selector: 'app-greeter',
    templateUrl: './first-page.component.html',
    styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent {

    constructor(public storage: StorageService) {

    }

}
