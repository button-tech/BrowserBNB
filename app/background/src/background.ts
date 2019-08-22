// function f() {
//
//     // const data = {a: 1};
//     // const password = '11';
//
//     // timer(0, 2000).subscribe(() => {
//     //     console.log('1123');
//     // });
//
//     // const encrypted = await passworder.encrypt(password, data);
//     // console.log(encrypted);
//
//     // let a = "https://dex.binance.org/api/v1/account/bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu";
//     // const x = fetch(a).then((x) => {
//     //     x.json().then((obj) => {
//     //         debugger
//     //     })
//     // })
// }
import { approveSession } from "./walletconnect/walletconnect";
import { Session } from "./session/session";

console.log('Hi!');

const session = new Session();

chrome.runtime.onConnect.addListener((port) => {

    console.log('port connected');
    port.onMessage.addListener((msg: MessageBase) => {

        // TODO: check message type, call widget awnd give widget ability to approve.
        console.log("message received:" + msg);
        // approveSession(msg);

        if (msg && msg.type) {

            if (msg.type === 'initWalletConnectSession') {
                // const link = (msg as FromContent2BackgroundMsg).wcDeepLink;
                // approveSession(link);
            } else {
                const response = session.processMessageFromPage(msg as FromPage2BackgroundMsg);
                if (response) {
                    port.postMessage(response);
                }
            }
        }
    });
});

setTimeout(() => {
    chrome.tabs.create({url:"index.html?#/registration/import"});

    // //const extensionId = chrome.runtime.id;
    // //const url = `chrome-extension://${extensionId}/greeter`;
    // const url = `index.html?state="registration/import"`;
    //
    // // host: "dfiibgbgnmgilhfanmbhcgbfoadmmadd"
    // // hostname: "dfiibgbgnmgilhfanmbhcgbfoadmmadd"
    // // href: "chrome-extension://dfiibgbgnmgilhfanmbhcgbfoadmmadd/registration/import"
    // // origin: "chrome-extension://dfiibgbgnmgilhfanmbhcgbfoadmmadd"
    // // pathname: "/registration/import"
    //
    // window.open(url, "extension_popup", "width=350,height=590,status=no,scrollbars=yes,resizable=no");
}, 300);
