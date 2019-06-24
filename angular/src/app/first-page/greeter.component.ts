import { Component, OnInit } from '@angular/core';
// import * as Binance from '../../assets/binance/bnbSDK.js'
@Component({
  selector: 'app-greeter',
  templateUrl: './greeter.component.html',
  styleUrls: ['./greeter.component.css']
})
export class GreeterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // console.log(Binance.createMnemonic())
  }

}
