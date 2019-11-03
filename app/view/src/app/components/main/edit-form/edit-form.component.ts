import {Component, EventEmitter, Host, Input, Optional, Output} from '@angular/core';
import {SatPopover} from '@ncstate/sat-popover';
import {LocalStorageService} from "../../../services/local-storage.service";

@Component({
    selector: 'app-edit-form',
    templateUrl: './edit-form.component.html',
    styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent {

    @Input()
    value = '';

    @Output()
    update = new EventEmitter<string>();

    constructor(@Optional() @Host() public popover: SatPopover, private localStorageService: LocalStorageService) {
    }

    onSubmit() {
        this.update.next(this.value);
        this.popover.close();
    }
}
