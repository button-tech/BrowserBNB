import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from '../services/storage.service';
import {ToastrManager} from 'ng6-toastr-notifications';

@Component({
    selector: 'app-unlock',
    templateUrl: './unlock.component.html',
    styleUrls: ['./unlock.component.css']
})
export class UnlockComponent implements OnInit {
    keystore: any;

    constructor(private router: Router, private storage: StorageService, public toastr: ToastrManager) {
    }

    ngOnInit() {
    }

    unlock() {
        const password = (document.getElementById('password') as HTMLInputElement).value;

        // showWrongPasswordMessage();
        // TODO: use login to compare with password hash and un
        this.router.navigate(['/main']);
    }

    showWrongPasswordMessage() {
        this.toastr.errorToastr('Password is incorrect', 'Error', {
            position: 'top-full-width',
            maxShown: 1,
            showCloseButton: true,
            toastTimeout: 5000
        });
    }

    reset() {
        this.storage.reset().then(() => {
            this.router.navigate(['/greeter']);
        });
    }
}
