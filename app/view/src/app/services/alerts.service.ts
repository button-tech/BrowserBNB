import {Injectable} from '@angular/core';
import {ToastrManager} from "ng6-toastr-notifications";

@Injectable({
    providedIn: 'root'
})
export class AlertsService {

    constructor(public toastr: ToastrManager) {
    }

    showError(message: string, title: string) {
        this.toastr.errorToastr(message, title, {
            position: 'top-full-width',
            maxShown: 1,
            showCloseButton: true,
            toastTimeout: 5000
        });
    }
}
