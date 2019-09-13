export class Session {

    password: string = '';

    login(password: string) {
        this.password = password;
    };

    logout(): void {
        this.password = '';
    };

    processMessageFromPage(msg: FromPage2BackgroundMsg): FromBackgroundToPageMsg | undefined {
        if (msg.type === 'startExtensionSession') {
            this.login(msg.password);
        } else if (msg.type === 'dropExtensionSession') {
            this.logout();
        } else if (msg.type === 'restoreExtensionSessionRequest') {

            const response: FromBackgroundToPageMsg = {
                type: 'restoreSessionResponse',
                password: this.password || '',
                isExpired: !this.password
            };

            return response;
        }
    }
}

// export class Session {
//
//     password: string = '';
//
//     private keepAliveReceived: boolean = false;
//     private intervalId: number = 0;
//
//     login(password: string, timeoutInMilliseconds: number) {
//         if (this.intervalId) {
//             clearInterval(this.intervalId); // Cleanup previous session
//         }
//
//
//         this.password = password;
//         this.keepAliveReceived = true;
//
//         // @ts-ignore
//         this.intervalId = setInterval(() => {
//             if (this.keepAliveReceived) {
//                 this.keepAliveReceived = false;
//             } else {
//                 this.logout();
//             }
//         }, timeoutInMilliseconds);
//
//     };
//
//     onKeepAlive() {
//         this.keepAliveReceived = true;
//     }
//
//     logout(): void {
//         this.password = '';
//         clearInterval(this.intervalId);
//     };
//
//     processMessageFromPage(msg: FromPage2BackgroundMsg): FromBackgroundToPageMsg | undefined {
//         if (msg.type === 'startExtensionSession') {
//             this.login(msg.password, msg.timeout);
//         } else if (msg.type === 'dropExtensionSession') {
//             this.logout();
//         } else if (msg.type === 'keepAlive') {
//             this.onKeepAlive();
//         } else if (msg.type === 'restoreExtensionSessionRequest') {
//
//             const response: FromBackgroundToPageMsg = {
//                 type: 'restoreSessionResponse',
//                 password: this.password || '',
//                 isExpired: !this.password
//             };
//
//             if (this.password) {
//                 this.keepAliveReceived = true;
//             }
//
//             return response;
//         }
//     }
// }
