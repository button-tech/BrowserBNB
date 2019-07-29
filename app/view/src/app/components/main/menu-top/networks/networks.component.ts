import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IMenuItem, StorageService} from "../../../../services/storage.service";
import {BehaviorSubject} from "rxjs";
import {CurrentAccountService} from "../../../../services/current-account.service";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: ['./networks.component.css']
})
export class NetworksComponent implements OnInit {

  // @ts-ignore
  @ViewChild('menuNetwork')
  menuNetwork: ElementRef;

  networkMenu: IMenuItem[];
  selectedNetwork$: BehaviorSubject<IMenuItem>;
  userItems: IMenuItem[] = [];
  constructor(public currentAccount: CurrentAccountService,
              public storage: StorageService,
  ) {

    this.selectedNetwork$ = this.storage.selectedNetwork$;
    this.networkMenu = this.storage.networkMenu;

  }

  ngOnInit() {
  }

  selectNetwork(value: IMenuItem) {
    this.storage.selectedNetwork$.next(value);
  }

}
