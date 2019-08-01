import * as passworder from 'browser-passworder';
import { timer } from "rxjs";

function f() {
    const data = {a: 1};

    const password = '11';

    timer(0, 2000).subscribe(() => {
        console.log('1123');
    });

    passworder.encrypt(password, data).then((encrypted) => {
        console.log(encrypted);
        debugger;
    });


    let a = "https://dex.binance.org/api/v1/account/bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu";
    const x = fetch(a).then((x) => {
        x.json().then((obj) => {
            debugger
        })
    })
}

f();
