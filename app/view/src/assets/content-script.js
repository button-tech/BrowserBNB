(function () {
    'use strict';

    var injectable = "var intervalId = setInterval(() => {\r\n    const btn = document.getElementById('Unlock_Wallet_Connect');\r\n    if (btn) {\r\n        clearInterval(intervalId);\r\n        btn.click();\r\n    }\r\n}, 100);\r\n\r\nvar stepOneIntervalId = setInterval(() => {\r\n    const btn = document.getElementById('connectBtn');\r\n    if (btn) {\r\n        clearInterval(stepOneIntervalId);\r\n        btn.click();\r\n    }\r\n}, 100);\r\n\r\nvar stepTwoIntervalId = setInterval(() => {\r\n    const btn = document.getElementById('use-walletconnect');\r\n    if (btn) {\r\n        clearInterval(stepTwoIntervalId);\r\n        btn.click();\r\n    }\r\n}, 100);\r\n\r\nconst defaultLog = console.log.bind(console);\r\nconsole.log = function () {\r\n    defaultLog.apply(console, arguments);\r\n\r\n    if (arguments[0] === 'WalletConnect URI') {\r\n        window.postMessage({type: \"FROM_PAGE\", text: arguments[1]}, \"*\");\r\n        return\r\n    }\r\n\r\n    if (arguments[0] && arguments[0].startsWith(\"wc:\")) {\r\n\r\n        window.postMessage({type: \"FROM_PAGE\", text: arguments[0]}, \"*\");\r\n    }\r\n};\r\n";

    // @ts-ignore
    // // https://platform.trustwallet.com/
    const binanceHrefRe = /https:\/\/www\.binance.org\/..\/unlock/;
    const trustHrefRe = /https:\/\/platform\.trustwallet.org/;
    const href = window.location.href;
    if (binanceHrefRe.test(href) || trustHrefRe.test(href) || true) {
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
    }

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC1zY3JpcHQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbnRlbnQtc2NyaXB0L3NyYy9jb250ZW50LXNjcmlwdC5wcm9kLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEB0cy1pZ25vcmVcclxuaW1wb3J0ICogYXMgY29uc29sZUxpc3RlbmVyIGZyb20gJy4vaW5qZWN0YWJsZS5qcyc7XHJcblxyXG4vLyAvLyBodHRwczovL3BsYXRmb3JtLnRydXN0d2FsbGV0LmNvbS9cclxuY29uc3QgYmluYW5jZUhyZWZSZSA9IC9odHRwczpcXC9cXC93d3dcXC5iaW5hbmNlLm9yZ1xcLy4uXFwvdW5sb2NrLztcclxuY29uc3QgdHJ1c3RIcmVmUmUgPSAvaHR0cHM6XFwvXFwvcGxhdGZvcm1cXC50cnVzdHdhbGxldC5vcmcvO1xyXG5jb25zdCBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcblxyXG5pZiAoYmluYW5jZUhyZWZSZS50ZXN0KGhyZWYpIHx8IHRydXN0SHJlZlJlLnRlc3QoaHJlZikgfHwgdHJ1ZSkge1xyXG5cclxuICAgIHtcclxuICAgICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICBzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XHJcbiAgICAgICAgLy8gVE9ETzogZml4IHRoYXQgb24gYmluYW5jZSBET00gc2lkZVxyXG4gICAgICAgIHNjcmlwdC5pbm5lckhUTUwgPSBjb25zb2xlTGlzdGVuZXIuZGVmYXVsdDtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWNlaXZlZCBpbiBjb250ZW5ldCBzY3JpcHQ6JywgZXZlbnQpO1xyXG5cclxuICAgICAgICAvLyBXZSBvbmx5IGFjY2VwdCBtZXNzYWdlcyBmcm9tIG91cnNlbHZlc1xyXG4gICAgICAgIGlmIChldmVudC5zb3VyY2UgIT0gd2luZG93KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChldmVudC5kYXRhLnR5cGUgJiYgKGV2ZW50LmRhdGEudHlwZSA9PT0gXCJGUk9NX1BBR0VcIikpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb250ZW50IHNjcmlwdCByZWNlaXZlZDogXCIgKyBldmVudC5kYXRhLnRleHQpO1xyXG4gICAgICAgICAgICBjb25zdCB3Y0xpbmsgPSBldmVudC5kYXRhLnRleHQ7XHJcbiAgICAgICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHt3Y0xpbmt9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sIGZhbHNlKTtcclxufVxyXG5cclxuIl0sIm5hbWVzIjpbImNvbnNvbGVMaXN0ZW5lci5kZWZhdWx0Il0sIm1hcHBpbmdzIjoiOzs7OztJQUFBO0FBQ0EsSUFFQTtJQUNBLE1BQU0sYUFBYSxHQUFHLHdDQUF3QyxDQUFDO0lBQy9ELE1BQU0sV0FBVyxHQUFHLHFDQUFxQyxDQUFDO0lBQzFELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBRWxDLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtRQUU1RDtZQUNJLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQzs7WUFFaEMsTUFBTSxDQUFDLFNBQVMsR0FBR0EsVUFBdUIsQ0FBQztZQUMzQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNyQztRQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFLO1lBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDLENBQUM7O1lBR25ELElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxNQUFNO2dCQUN0QixPQUFPO1lBRVgsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxXQUFXLENBQUMsRUFBRTtnQkFDdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDL0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBQyxNQUFNLEVBQUMsRUFBRTtpQkFDcEMsQ0FBQyxDQUFDO2FBQ047U0FDSixFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ2I7Ozs7In0=
