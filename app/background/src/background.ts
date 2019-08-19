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

        // TODO: check message type, call widget and give widget ability to approve.
        console.log("message received:" + msg);
        // approveSession(msg);

        if (msg && msg.type) {

            if (msg.type === 'initWalletConnectSession') {
                const link = (msg as FromContent2BackgroundMsg).wcDeepLink;
                approveSession(link);
            } else {
                const response = session.processMessageFromPage(msg as FromPage2BackgroundMsg);
                if (response) {
                    port.postMessage(response);
                }
            }
        }
    });
});
