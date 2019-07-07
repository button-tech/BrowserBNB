import {Component, OnInit} from '@angular/core';
import {AccountService} from '../services/account.service';
import {Router} from '@angular/router';
import {StorageService} from '../services/storage.service';

@Component({
    selector: 'app-greeter',
    templateUrl: './greeter.component.html',
    styleUrls: ['./greeter.component.css']
})
export class GreeterComponent {

    constructor(private router: Router, public storage: StorageService, private memory: AccountService) {
        
    }

}
