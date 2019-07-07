import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IAccount} from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class ClipboardService {

    constructor() {
    }

    copyToClipboard(value: any) {
        const obj = document.createElement('textarea');
        obj.style.position = 'fixed';
        obj.style.left = '0';
        obj.style.top = '0';
        obj.style.opacity = '0';
        obj.value = value;
        document.body.appendChild(obj);
        obj.focus();
        obj.select();
        document.execCommand('copy');
        document.body.removeChild(obj);
    }
}
