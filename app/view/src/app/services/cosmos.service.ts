import { Injectable } from '@angular/core';
import { signWithPrivateKey } from "@lunie/cosmos-keys";
import Cosmos from "@lunie/cosmos-js";
@Injectable({
  providedIn: 'root'
})
export class CosmosService {

  constructor() { }

  async sendTransaction() {
      const privateKey = Buffer.from(...);
      const publicKey = Buffer.from('02bceac71ab99b5d95118e8b173a99abc601c20219f951c6c36cdcd7cd300d55c3');

// init cosmos sender
      const cosmos = Cosmos('https://cosmos-rpc.trustwalletapp.com/txs', 'cosmos1phzk96xke3wf9esuys7hkllpltx57sjrhdqymz');

// create message
      const msg = cosmos
          .MsgSend({toAddress: 'cosmos1et7a8svmxfkz23mn280k34q6upj36d7lggflpa', amounts: [{ denom: 'stake', amount: 10 }]});

// create a signer from this local js signer library
      const localSigner = (signMessage) => {
          const signature = signWithPrivateKey(signMessage, privateKey);

          return {
              signature,
              publicKey
          };
      };

// send the transaction
      const { included } = await msg.send({ gas: 200000 }, localSigner);

// await tx to be included in a block
      await included();
  }
}


