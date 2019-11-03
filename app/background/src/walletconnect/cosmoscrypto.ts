/*
 * MIT License
 *
 * Copyright (c) 2019 BUTTON Wallet
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */
// @ts-ignore
import * as Cosmos from '../../../view/src/assets/cosmos/cosmosSDK.js';

export function signRawMessage( pk: string, rawMsg: any ): any {
    const cosmos = Cosmos.network('https://lcd-do-not-abuse.cosmostation.io', 'cosmoshub-2');
    cosmos.setBech32MainPrefix("cosmos");
    const ecpairPriv = Buffer.from(pk, 'hex');
    return cosmos.sign(rawMsg, ecpairPriv);
}
