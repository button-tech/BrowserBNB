import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
@Component({
  selector: 'app-amount-input',
  templateUrl: './amount-input.component.html',
  styleUrls: ['./amount-input.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AmountInputComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

    emailFormControl = new FormControl('', [
    ]);

}
