/// <reference types="chrome"/>
import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'background';

  constructor() {
    console.log('background works!');
    chrome.runtime.onConnect.addListener(function (port) {
      port.postMessage({greeting: "hello"});
    });

  }


}
