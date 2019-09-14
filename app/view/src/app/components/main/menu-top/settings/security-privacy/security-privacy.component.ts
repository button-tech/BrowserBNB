import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-security-privacy',
  templateUrl: './security-privacy.component.html',
  styleUrls: ['./security-privacy.component.css']
})
export class SecurityPrivacyComponent implements OnInit {

  constructor(private location: Location, private router: Router) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

  navigateToApproval(operation: string) {
    this.router.navigate([`/approve/${operation}`]);
  }

}
