import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";

const removeAccountText = 'You will loose access to account. The only one option to restore access is to have mnemonic';
const seedRevealText = 'Do not show mnemonic to anybody and keep it safe';
const removeAllText = 'We will remove all current data about accounts for forever. You can access them with backed up mnemonic phrase';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css']
})
export class ApproveComponent implements OnInit {

  message: string;

  constructor(private location: Location, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const operation = this.activatedRoute.snapshot.params.operation;
    switch (operation) {
      case 'removeaccount':
        this.message = removeAccountText;
        break;
      case 'removeall':
        this.message = removeAllText;
        break;
      case 'seed':
        this.message = seedRevealText;
        break;
      default:
        this.message = seedRevealText;
        break;
    }
  }

  goBack() {
    this.location.back();
  }

}
