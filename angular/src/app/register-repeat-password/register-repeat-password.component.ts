import {Component, OnInit} from '@angular/core';
import {MemoryService} from "../services/memory.service";
import * as Binance from '../../assets/binance/bnbSDK.js'
import { ToastrManager } from 'ng6-toastr-notifications';
import {Router } from "@angular/router";
@Component({
    selector: 'app-register-repeat-password',
    templateUrl: './register-repeat-password.component.html',
    styleUrls: ['./register-repeat-password.component.css']
})
export class RegisterRepeatPasswordComponent implements OnInit {

    constructor(private memory: MemoryService, public toastr: ToastrManager, private router: Router ) {

    }

    ngOnInit() {
    }

    showError() {
        this.toastr.errorToastr("Passwords don't match", 'Error', {position: 'top-full-width', maxShown: 1, showCloseButton: true, toastTimeout: 5000});
        (<HTMLInputElement>document.getElementById('backButton')).style.display = 'inline-block';
    }

    checkPassword() {
        let password = (<HTMLInputElement>document.getElementById('password')).value;
        let newHash = Binance.sha3(password)
        if (newHash === this.memory.getCurrentPasswordHash()) {
            this.router.navigate(['/main']);
            return true;
        }
        else {
            this.showError();
            return false;
        }
    }


}
