import * as passworder from 'browser-passworder';
import { timer } from "rxjs";

async function f() {

    //console.log(chrome.extension.onConnect.addListener);

    // @ts-ignore
    chrome.extension.onConnect.addListener(function (port) {
        console.log("Connected .....");
        port.onMessage.addListener(function (msg) {
            console.log("message recieved" + msg);
            port.postMessage("Hi Popup.js");
        });
    });


    const data = {a: 1};

    const password = '11';

    timer(0, 2000).subscribe(() => {
        console.log('1123');
    });

    const encrypted = await passworder.encrypt(password, data);
    console.log(encrypted);

    let a = "https://dex.binance.org/api/v1/account/bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu";
    const x = fetch(a).then((x) => {
        x.json().then((obj) => {
            debugger
        })
    })
}

f();
