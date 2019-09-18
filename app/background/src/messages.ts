type FromPage2BackgroundMsg = {
    type: 'startExtensionSession' | 'dropExtensionSession' | 'keepAlive' | 'restoreExtensionSessionRequest'
    password: string;
    timeout: number;
}

type FromContent2BackgroundMsg = {
    type: 'initWalletConnectSession'
    wcDeepLink: string
}

type FromBackgroundToPageMsg = {
    type: 'restoreSessionResponse'
    isExpired: boolean;
    password: string;
}

interface MessageBase {
    type: string
}
