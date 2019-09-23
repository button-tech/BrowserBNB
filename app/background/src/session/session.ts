import {FromBackgroundToPageMsg, FromPage2BackgroundMsg} from "../../../view/src/app/services/chrome-api-dto";

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
            this.login(msg.password || '');
        } else if (msg.type === 'dropExtensionSession') {
            this.logout();
        } else if (msg.type === 'restoreExtensionSessionRequest') {

            return {
                type: 'restoreSessionResponse',
                password: this.password || '',
                isExpired: !this.password
            };
        }
    }
}
