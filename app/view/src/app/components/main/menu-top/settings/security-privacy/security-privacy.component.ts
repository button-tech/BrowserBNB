import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-security-privacy',
  templateUrl: './security-privacy.component.html',
  styleUrls: ['./security-privacy.component.css']
})
export class SecurityPrivacyComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

}
