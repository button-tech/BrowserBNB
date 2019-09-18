import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {StateService} from "../../../../../../services/state.service";
import {ClipboardService} from "../../../../../../services/clipboard.service";

@Component({
  selector: 'app-seed',
  templateUrl: './seed.component.html',
  styleUrls: ['./seed.component.css']
})
export class SeedComponent implements OnInit {

  mnemonic: string;
  copyMessage = 'Copy to clipboard';
  constructor( private router: Router,
               private state: StateService,
               private clipboardService: ClipboardService) { }

  ngOnInit() {
    this.mnemonic = this.state.uiState.storageData.seedPhrase;
  }

  goBack() {
    this.router.navigate(['/main']);
  }

  copyIt() {
      this.clipboardService.copyToClipboard(this.mnemonic);
      this.copyMessage = 'Copied ✔';
  }
}
