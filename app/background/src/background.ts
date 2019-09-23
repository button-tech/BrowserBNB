import {handlePasswordConnections} from "./session/port-password-pipeline";
import {handleWalletConnectConnections} from "./walletconnect/port-wc-pipeline";

handlePasswordConnections();
handleWalletConnectConnections();
