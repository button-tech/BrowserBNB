export interface FromPage2BackgroundMsg {
    type: 'startExtensionSession' | 'dropExtensionSession' | 'keepAlive' | 'restoreExtensionSessionRequest'
    password?: string;
    timeout?: number;
}

export interface FromContent2BackgroundMsg {
    type: 'initWalletConnectSession';
    wcDeepLink: string;
}

export interface FromBackgroundToPageMsg {
    type: 'restoreSessionResponse';
    isExpired: boolean;
    password: string;
}

export interface MessageBase {
    type: string;
}
