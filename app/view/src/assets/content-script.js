(function () {
    'use strict';

    var injectable = "// setTimeout(() => {\r\n//\r\n//     if (window.isConnected) {\r\n//         return;\r\n//     }\r\n//\r\n//     var intervalId = setInterval(() => {\r\n//         const btn = document.getElementById('Unlock_Wallet_Connect');\r\n//         if (btn) {\r\n//             clearInterval(intervalId);\r\n//             btn.click();\r\n//         }\r\n//     }, 100);\r\n//\r\n//     // var stepOneIntervalId = setInterval(() => {\r\n//     //     const btn = document.getElementById('connectBtn');\r\n//     //     if (btn) {\r\n//     //         clearInterval(stepOneIntervalId);\r\n//     //         btn.click();\r\n//     //     }\r\n//     // }, 100);\r\n//     //\r\n//     // var stepTwoIntervalId = setInterval(() => {\r\n//     //     const btn = document.getElementById('use-walletconnect');\r\n//     //     if (btn) {\r\n//     //         clearInterval(stepTwoIntervalId);\r\n//     //         btn.click();\r\n//     //     }\r\n//     // }, 100);\r\n//\r\n// }, 1500);\r\n\r\n\r\nwindow.wasShown = false;\r\nconst defaultLog = console.log.bind(console);\r\nconsole.log = function () {\r\n    defaultLog.apply(console, arguments);\r\n\r\n    // if (arguments[0] && arguments[0].startsWith && arguments[0] === \"isAuthorized\") {\r\n    //     window.isConnected = true;\r\n    //     return;\r\n    // }\r\n    if (window.wasShown) {\r\n        return;\r\n    }\r\n\r\n    if (arguments[0] && arguments[0].startsWith && arguments[0].startsWith(\"wc:\")) {\r\n        window.postMessage({type: \"FROM_PAGE\", text: arguments[0]}, \"*\");\r\n        window.wasShown = true;\r\n        return;\r\n    }\r\n\r\n    if (arguments[0] === 'WalletConnect URI') {\r\n        window.postMessage({type: \"FROM_PAGE\", text: arguments[1]}, \"*\");\r\n        window.wasShown = true;\r\n        return;\r\n    }\r\n\r\n    // if (arguments[0] && arguments[0].startsWith && arguments[0].startsWith(\"wc:\")) {\r\n    //     window.wasShown = true;\r\n    //     window.postMessage({type: \"FROM_PAGE\", text: arguments[0]}, \"*\");\r\n    //     return;\r\n    // }\r\n};\r\n";

    // @ts-ignore
    // // https://platform.trustwallet.com/
    // const binanceHrefRe = /https:\/\/www\.binance.org\/..\/unlock/;
    // const trustHrefRe = /https:\/\/platform\.trustwallet.org/;
    // const href = window.location.href;
    // if (true) {
    {
        const script = document.createElement('script');
        script.type = "text/javascript";
        // TODO: fix that on binance DOM side
        script.innerHTML = injectable;
        document.body.appendChild(script);
    }
    window.addEventListener("message", (event) => {
        console.log('received in contenet script:', event);
        // We only accept messages from ourselves
        if (event.source != window)
            return;
        if (event.data.type && (event.data.type === "FROM_PAGE")) {
            console.log("Content script received: " + event.data.text);
            const wcLink = event.data.text;
            chrome.runtime.sendMessage({ wcLink }, () => {
            });
        }
    }, false);
    // }

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC1zY3JpcHQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbnRlbnQtc2NyaXB0L3NyYy9jb250ZW50LXNjcmlwdC5wcm9kLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEB0cy1pZ25vcmVcclxuaW1wb3J0ICogYXMgY29uc29sZUxpc3RlbmVyIGZyb20gJy4vaW5qZWN0YWJsZS5qcyc7XHJcblxyXG4vLyAvLyBodHRwczovL3BsYXRmb3JtLnRydXN0d2FsbGV0LmNvbS9cclxuLy8gY29uc3QgYmluYW5jZUhyZWZSZSA9IC9odHRwczpcXC9cXC93d3dcXC5iaW5hbmNlLm9yZ1xcLy4uXFwvdW5sb2NrLztcclxuLy8gY29uc3QgdHJ1c3RIcmVmUmUgPSAvaHR0cHM6XFwvXFwvcGxhdGZvcm1cXC50cnVzdHdhbGxldC5vcmcvO1xyXG4vLyBjb25zdCBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbi8vIGlmICh0cnVlKSB7XHJcblxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgIHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcclxuICAgICAgICAvLyBUT0RPOiBmaXggdGhhdCBvbiBiaW5hbmNlIERPTSBzaWRlXHJcbiAgICAgICAgc2NyaXB0LmlubmVySFRNTCA9IGNvbnNvbGVMaXN0ZW5lci5kZWZhdWx0O1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3JlY2VpdmVkIGluIGNvbnRlbmV0IHNjcmlwdDonLCBldmVudCk7XHJcblxyXG4gICAgICAgIC8vIFdlIG9ubHkgYWNjZXB0IG1lc3NhZ2VzIGZyb20gb3Vyc2VsdmVzXHJcbiAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSAhPSB3aW5kb3cpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50LmRhdGEudHlwZSAmJiAoZXZlbnQuZGF0YS50eXBlID09PSBcIkZST01fUEFHRVwiKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbnRlbnQgc2NyaXB0IHJlY2VpdmVkOiBcIiArIGV2ZW50LmRhdGEudGV4dCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHdjTGluayA9IGV2ZW50LmRhdGEudGV4dDtcclxuICAgICAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe3djTGlua30sICgpID0+IHtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgZmFsc2UpO1xyXG4vLyB9XHJcblxyXG4iXSwibmFtZXMiOlsiY29uc29sZUxpc3RlbmVyLmRlZmF1bHQiXSwibWFwcGluZ3MiOiI7Ozs7O0lBQUE7QUFDQSxJQUVBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFFSTtRQUNJLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQzs7UUFFaEMsTUFBTSxDQUFDLFNBQVMsR0FBR0EsVUFBdUIsQ0FBQztRQUMzQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNyQztJQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFLO1FBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDLENBQUM7O1FBR25ELElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxNQUFNO1lBQ3RCLE9BQU87UUFFWCxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQVcsQ0FBQyxFQUFFO1lBQ3RELE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMvQixNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFDLE1BQU0sRUFBQyxFQUFFO2FBQ3BDLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2QsSUFBSTs7OzsifQ==
