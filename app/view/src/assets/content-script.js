(function () {
    'use strict';

    var tpl = "var intervalId = setInterval(() => {\r\n    const btn = document.getElementById('Unlock_Wallet_Connect');\r\n    if(btn){\r\n        clearInterval(intervalId);\r\n        btn.click();\r\n    }\r\n}, 100);\r\n\r\nconst defaultLog = console.log.bind(console);\r\nconsole.log = function () {\r\n    defaultLog.apply(console, arguments);\r\n    if(arguments[0]==='WalletConnect URI' ){\r\n        window.postMessage({ type: \"FROM_PAGE\", text: arguments[1] }, \"*\");\r\n    }\r\n};\r\n";

    // @ts-ignore
    // TODO: add development and production manifest, allow localhost:4200 only in development manifest
    const hrefRe = /https:\/\/www\.binance.org\/..\/unlock/;
    if (hrefRe.test(window.location.href) || window.location.href.startsWith('http://localhost:4200')) {
        const script = document.createElement('script');
        script.type = "text/javascript";
        script.innerHTML = tpl;
        document.body.appendChild(script);
        window.addEventListener("message", (event) => {
            console.log('received in content script:', event);
            // We only accept messages from ourselves
            if (event.source != window)
                return;
            if (event.data.type && (event.data.type === "FROM_PAGE")) {
                console.log("Content script received: " + event.data.text);
                const wcLink = event.data.text;
                chrome.runtime.sendMessage({ wcLink }, () => {
                });
            }
            // TODO: communicate via local storage
            // if (event.data.type && (event.data.type === "TO_BG")) {
            //     console.log("TO_BG: " + event.data);
            //     port.postMessage(event.data.msg);
            // }
        }, false);
    }
    // // TODO: Move this to dev build, security gap
    // port.onMessage.addListener((msg: Event) => {
    //     console.log('to page:', msg);
    //     window.postMessage({type: 'TO_PAGE', msg}, "*");
    // });
    // console.defaultLog('1', window.logs)
    //
    // const interval = setInterval(() => {
    //     //const hasUnlockWcButton = document.getElementById("Unlock_Wallet_Connect");
    //     const qrWasShown = document.querySelector(".qrcode-box")
    //     if (!qrWasShown)
    //         return
    //
    //     const msgItem = window.logs.slice().reverse()
    //       .find((item) => item && item[0] === 'WalletConnect URI' && msgItem[1])
    //
    //     if (msgItem && msgItem[1]) {
    //         const uri = msgItem[1]
    //         window.console.defaultLog(uri)
    //         clearInterval(interval)
    //     }
    // }, 1000);
    //
    // // debugger;
    //
    // // const interval = setInterval(() => {
    // //     //const hasUnlockWcButton = document.getElementById("Unlock_Wallet_Connect");
    // //     const qrWasShown = document.querySelector(".qrcode-box")
    // //
    // //     const msgItem = window.x1.slice().reverse()
    // //         .find((item) => item && item[0] === 'WalletConnect URI' && msgItem[1])
    // //
    // //     if (msgItem && msgItem[1]) {
    // //         const uri = msgItem[1]
    // //         window.console.defaultLog(uri);
    // //         clearInterval(interval)
    // //     }
    // // }, 1000)
    //
    // // var port = chrome.runtime.connect();
    // //
    // // window.addEventListener("message", function(event) {
    // //     // We only accept messages from ourselves
    // //     if (event.source != window)
    // //         return;
    // //
    // //     if (event.data.type && (event.data.type == "FROM_PAGE")) {
    // //         console.log("Content script received: " + event.data.text);
    // //         port.postMessage(event.data.text);
    // //     }
    // // }, false);
    //
    // // document.getElementById("theButton").addEventListener("click",
    // //   function() {
    // //       window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
    // //   }, false);

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC1zY3JpcHQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbnRlbnQtc2NyaXB0L3NyYy9jb250ZW50LXNjcmlwdC5kZXYudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWlnbm9yZVxyXG5pbXBvcnQgdHBsIGZyb20gXCIuL2luamVjdGFibGUuanNcIjtcclxuXHJcbi8vIFRPRE86IGFkZCBkZXZlbG9wbWVudCBhbmQgcHJvZHVjdGlvbiBtYW5pZmVzdCwgYWxsb3cgbG9jYWxob3N0OjQyMDAgb25seSBpbiBkZXZlbG9wbWVudCBtYW5pZmVzdFxyXG5jb25zdCBocmVmUmUgPSAvaHR0cHM6XFwvXFwvd3d3XFwuYmluYW5jZS5vcmdcXC8uLlxcL3VubG9jay87XHJcbmlmIChocmVmUmUudGVzdCh3aW5kb3cubG9jYXRpb24uaHJlZikgfHwgd2luZG93LmxvY2F0aW9uLmhyZWYuc3RhcnRzV2l0aCgnaHR0cDovL2xvY2FsaG9zdDo0MjAwJykpIHtcclxuXHJcbiAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgIHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcclxuICAgIHNjcmlwdC5pbm5lckhUTUwgPSB0cGw7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWNlaXZlZCBpbiBjb250ZW50IHNjcmlwdDonLCBldmVudCk7XHJcblxyXG4gICAgICAgIC8vIFdlIG9ubHkgYWNjZXB0IG1lc3NhZ2VzIGZyb20gb3Vyc2VsdmVzXHJcbiAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSAhPSB3aW5kb3cpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50LmRhdGEudHlwZSAmJiAoZXZlbnQuZGF0YS50eXBlID09PSBcIkZST01fUEFHRVwiKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbnRlbnQgc2NyaXB0IHJlY2VpdmVkOiBcIiArIGV2ZW50LmRhdGEudGV4dCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHdjTGluayA9IGV2ZW50LmRhdGEudGV4dDtcclxuICAgICAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe3djTGlua30sICgpID0+IHtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUT0RPOiBjb21tdW5pY2F0ZSB2aWEgbG9jYWwgc3RvcmFnZVxyXG4gICAgICAgIC8vIGlmIChldmVudC5kYXRhLnR5cGUgJiYgKGV2ZW50LmRhdGEudHlwZSA9PT0gXCJUT19CR1wiKSkge1xyXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIlRPX0JHOiBcIiArIGV2ZW50LmRhdGEpO1xyXG4gICAgICAgIC8vICAgICBwb3J0LnBvc3RNZXNzYWdlKGV2ZW50LmRhdGEubXNnKTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgfSwgZmFsc2UpO1xyXG59XHJcbi8vIC8vIFRPRE86IE1vdmUgdGhpcyB0byBkZXYgYnVpbGQsIHNlY3VyaXR5IGdhcFxyXG4vLyBwb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnOiBFdmVudCkgPT4ge1xyXG4vLyAgICAgY29uc29sZS5sb2coJ3RvIHBhZ2U6JywgbXNnKTtcclxuLy8gICAgIHdpbmRvdy5wb3N0TWVzc2FnZSh7dHlwZTogJ1RPX1BBR0UnLCBtc2d9LCBcIipcIik7XHJcbi8vIH0pO1xyXG5cclxuXHJcbi8vIGNvbnNvbGUuZGVmYXVsdExvZygnMScsIHdpbmRvdy5sb2dzKVxyXG4vL1xyXG4vLyBjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuLy8gICAgIC8vY29uc3QgaGFzVW5sb2NrV2NCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlVubG9ja19XYWxsZXRfQ29ubmVjdFwiKTtcclxuLy8gICAgIGNvbnN0IHFyV2FzU2hvd24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnFyY29kZS1ib3hcIilcclxuLy8gICAgIGlmICghcXJXYXNTaG93bilcclxuLy8gICAgICAgICByZXR1cm5cclxuLy9cclxuLy8gICAgIGNvbnN0IG1zZ0l0ZW0gPSB3aW5kb3cubG9ncy5zbGljZSgpLnJldmVyc2UoKVxyXG4vLyAgICAgICAuZmluZCgoaXRlbSkgPT4gaXRlbSAmJiBpdGVtWzBdID09PSAnV2FsbGV0Q29ubmVjdCBVUkknICYmIG1zZ0l0ZW1bMV0pXHJcbi8vXHJcbi8vICAgICBpZiAobXNnSXRlbSAmJiBtc2dJdGVtWzFdKSB7XHJcbi8vICAgICAgICAgY29uc3QgdXJpID0gbXNnSXRlbVsxXVxyXG4vLyAgICAgICAgIHdpbmRvdy5jb25zb2xlLmRlZmF1bHRMb2codXJpKVxyXG4vLyAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpXHJcbi8vICAgICB9XHJcbi8vIH0sIDEwMDApO1xyXG4vL1xyXG4vLyAvLyBkZWJ1Z2dlcjtcclxuLy9cclxuLy8gLy8gY29uc3QgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbi8vIC8vICAgICAvL2NvbnN0IGhhc1VubG9ja1djQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJVbmxvY2tfV2FsbGV0X0Nvbm5lY3RcIik7XHJcbi8vIC8vICAgICBjb25zdCBxcldhc1Nob3duID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5xcmNvZGUtYm94XCIpXHJcbi8vIC8vXHJcbi8vIC8vICAgICBjb25zdCBtc2dJdGVtID0gd2luZG93LngxLnNsaWNlKCkucmV2ZXJzZSgpXHJcbi8vIC8vICAgICAgICAgLmZpbmQoKGl0ZW0pID0+IGl0ZW0gJiYgaXRlbVswXSA9PT0gJ1dhbGxldENvbm5lY3QgVVJJJyAmJiBtc2dJdGVtWzFdKVxyXG4vLyAvL1xyXG4vLyAvLyAgICAgaWYgKG1zZ0l0ZW0gJiYgbXNnSXRlbVsxXSkge1xyXG4vLyAvLyAgICAgICAgIGNvbnN0IHVyaSA9IG1zZ0l0ZW1bMV1cclxuLy8gLy8gICAgICAgICB3aW5kb3cuY29uc29sZS5kZWZhdWx0TG9nKHVyaSk7XHJcbi8vIC8vICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbClcclxuLy8gLy8gICAgIH1cclxuLy8gLy8gfSwgMTAwMClcclxuLy9cclxuLy8gLy8gdmFyIHBvcnQgPSBjaHJvbWUucnVudGltZS5jb25uZWN0KCk7XHJcbi8vIC8vXHJcbi8vIC8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbihldmVudCkge1xyXG4vLyAvLyAgICAgLy8gV2Ugb25seSBhY2NlcHQgbWVzc2FnZXMgZnJvbSBvdXJzZWx2ZXNcclxuLy8gLy8gICAgIGlmIChldmVudC5zb3VyY2UgIT0gd2luZG93KVxyXG4vLyAvLyAgICAgICAgIHJldHVybjtcclxuLy8gLy9cclxuLy8gLy8gICAgIGlmIChldmVudC5kYXRhLnR5cGUgJiYgKGV2ZW50LmRhdGEudHlwZSA9PSBcIkZST01fUEFHRVwiKSkge1xyXG4vLyAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29udGVudCBzY3JpcHQgcmVjZWl2ZWQ6IFwiICsgZXZlbnQuZGF0YS50ZXh0KTtcclxuLy8gLy8gICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKGV2ZW50LmRhdGEudGV4dCk7XHJcbi8vIC8vICAgICB9XHJcbi8vIC8vIH0sIGZhbHNlKTtcclxuLy9cclxuLy8gLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0aGVCdXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXHJcbi8vIC8vICAgZnVuY3Rpb24oKSB7XHJcbi8vIC8vICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSh7IHR5cGU6IFwiRlJPTV9QQUdFXCIsIHRleHQ6IFwiSGVsbG8gZnJvbSB0aGUgd2VicGFnZSFcIiB9LCBcIipcIik7XHJcbi8vIC8vICAgfSwgZmFsc2UpO1xyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7SUFBQTtBQUNBLElBRUE7SUFDQSxNQUFNLE1BQU0sR0FBRyx3Q0FBd0MsQ0FBQztJQUN4RCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsdUJBQXVCLENBQUMsRUFBRTtRQUUvRixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLENBQUM7UUFDaEMsTUFBTSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7UUFDdkIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFbEMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQUs7WUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxLQUFLLENBQUMsQ0FBQzs7WUFHbEQsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLE1BQU07Z0JBQ3RCLE9BQU87WUFFWCxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQVcsQ0FBQyxFQUFFO2dCQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzNELE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUMvQixNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFDLE1BQU0sRUFBQyxFQUFFO2lCQUNwQyxDQUFDLENBQUM7YUFDTjs7Ozs7O1NBUUosRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNiO0lBQ0Q7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUdBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxrQkFBa0I7Ozs7In0=
