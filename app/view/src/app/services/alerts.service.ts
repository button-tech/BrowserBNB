import {Injectable} from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})
export class AlertsService {

    constructor(private toastr: ToastrService) {
    }

    showError(message: string, title: string) {
        this.toastr.error(message, title);
    }
}
