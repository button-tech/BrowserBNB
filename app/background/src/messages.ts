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

// type FromPage2BackgroundMsg = {
//     type: 'StartSession' | 'DropSession' | 'KeepAlive' | 'RestoreSessionRequest'
//     password: string;
//     timeout: number;
// }
//
// type InitWalletConnectPayload = {
//     wcDeepLink: string
// }
//
// type FromBackgroundToPageMsg = {
//     type: 'restoreSessionResponse'
//     isExpired: boolean;
//     password: string;
// }
//
// interface MessageBase {
//     type: string
// }
//
// enum MessageType {
//     StartSession = "StartSession",
//     DropSession = "DropSession",
//     KeepAlive = "KeepAlive",
//     RestoreSessionRequest = "RestoreSessionRequest",
//     RestoreSessionResponse = "RestoreSessionResponse",
//
//     InitWalletConnect = "InitWalletConnect",
//
// }
//
// enum MessageSender {
//     ExtensionPage = "ExtensionPage",
//     BackgroundScript = "BackgroundScript",
//     ContentScript = "ContentScript",
// }
//
//
// type Message = {
//     sender: MessageSender,
//     type: MessageType,
//     payload: any
// }
//
// // enum MessageSender {
// //     Extension = "Extension",
// //     Background = "Background",
// //     ContentScript = "ContentScript",
// // }
//
// // enum MessagesType {
// //
// // }
