import { Injectable } from '@angular/core';
import * as Cosmos from '../../assets/cosmos/cosmosSDK.js';

@Injectable({
    providedIn: 'root'
})
export class CosmosService {

    constructor() { }

    async sendTransaction() {
        const chainId = "cosmoshub-2";
        const cosmos = Cosmos.returnInstance('https://lcd-do-not-abuse.cosmostation.io', 'cosmoshub-2');
        const mnemonic = '';
        cosmos.setBech32MainPrefix("cosmos");
        cosmos.setPath("m/44'/118'/0'/0/0");

        const ecpairPriv = cosmos.getECPairPriv(mnemonic);


        const stdSignMsg = cosmos.NewStdMsg({
            type: "cosmos-sdk/MsgSend",
            from_address: 'cosmos1phzk96xke3wf9esuys7hkllpltx57sjrhdqymz',
            to_address: "cosmos1et7a8svmxfkz23mn280k34q6upj36d7lggflpa",
            amountDenom: "uatom",
            amount: 100000,
            feeDenom: "uatom",
            fee: 5000,
            gas: 200000,
            memo: "",
            account_number: 22418,
            sequence: 1
        });
        const signedTx = cosmos.sign(stdSignMsg, ecpairPriv);
        cosmos.broadcast(signedTx).then(response => console.log(response));
    }
}

