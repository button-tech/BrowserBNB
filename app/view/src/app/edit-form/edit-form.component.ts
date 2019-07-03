import {EventEmitter, Component, Input, Output, Optional, Host, OnInit} from '@angular/core';
import {SatPopover} from '@ncstate/sat-popover';

@Component({
    selector: 'app-edit-form',
    templateUrl: './edit-form.component.html',
    styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent implements OnInit {

    @Input() value = '';

    @Output() update = new EventEmitter<string>();

    constructor(@Optional() @Host() public popover: SatPopover) {
    }

    onSubmit() {
        this.update.next(this.value);
        if (this.popover) {
            this.popover.close();
        }
    }

    ngOnInit() {
    }
}
