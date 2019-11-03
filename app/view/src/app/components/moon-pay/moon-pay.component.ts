import { Component, OnInit } from '@angular/core';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Route, Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import {StateService} from "../../services/state.service";
import {LocalStorageService} from "../../services/local-storage.service";

@Component({
  selector: 'app-moon-pay',
  templateUrl: './moon-pay.component.html',
  styleUrls: ['./moon-pay.component.css']
})
export class MoonPayComponent implements OnInit {

  public moonUrl: SafeResourceUrl;

  constructor(private router: Router,
              private stateService: StateService,
              private localStorageService: LocalStorageService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
        this.buildUrl();
  }

  close() {
    this.router.navigate(['/main']);
  }

  buildUrl() {
    this.moonUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://buy.moonpay.io?apiKey=pk_live_njmwryKl19yBDTysG6ETGCCytu4yruG` +
        this.buildCurrencyParam(this.localStorageService.currentBlockchain === "binance"
          ? "bnb" : "atom") +
        this.buildAddressParam(this.stateService.currentAddress));
  }

  buildCurrencyParam(currency: string): string {
    return `&currencyCode=${currency}`;
  }

  buildAddressParam(address: string): string {
    return `&walletAddress=${address}`;
  }
}
