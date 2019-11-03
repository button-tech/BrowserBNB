import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {StateService} from "../../services/state.service";
import {StorageService} from "../../services/storage.service";
import {LocalStorageService} from "../../services/local-storage.service";

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

  constructor(private location: Location,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private state: StateService,
              private storage: StorageService,
              public localStorageService: LocalStorageService) { }

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

  action() {
    const operation = this.activatedRoute.snapshot.params.operation;
    switch (operation) {
      case 'removeaccount':
             this.state.removeAccount(this.state.uiState.currentAccount);
             this.router.navigate(['/main']);
        break;
      case 'removeall':
        this.storage.reset();
        this.router.navigate(['/greeter']);
        break;
      case 'seed':
        this.router.navigate(['/seed']);
        break;
      default:
        this.message = seedRevealText;
        break;
    }
  }

}
