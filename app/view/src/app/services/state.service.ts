import { Injectable } from '@angular/core';
import { createMnemonic, getSHA3hashSum } from './binance-crypto';
import { IMenuItem, IStorageData, ITransaction, StorageService } from './storage.service';
import * as passworder from 'browser-passworder';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface ITransaction {
    Amount: number;
    AddressTo: string;
    AddressFrom: string;
    Memo: string;
    Symbol: string;
}

export interface IMenuItem {
    label: string;
    val: string;
    networkPrefix: string;
}

export interface IAccount {
    address;
    privateKey;
    accountName: string;
}

@Injectable()
export class StateService {


    // TODO: should be used only for UI, for traking purposes we should define another model
    currentTransaction: ITransaction = {
        'Amount': 0,
        'AddressTo': '',
        'AddressFrom': '',
        'Memo': '',
        'Symbol': ''
    };

    selectedNetwork$: BehaviorSubject<IMenuItem>;
    currentAccount$: Observable<IAccount>;

    networkMenu: IMenuItem[];

    constructor(private storageService: StorageService) {
        this.currentAccount$ = this.storageData$.pipe(
            filter((data) => {
                return data.AccountList.length > 0;
            }),
            map((data: IStorageData) => {
                const idx = data.CurrentAccountIdx;
                return data.AccountList[idx];
            })
        );
        this.networkMenu = [
            {
                label: 'MAINNET',
                networkPrefix: 'bnb',
                val: bncService.endpointList.MAINNET
            },
            {
                label: 'TESTNET',
                networkPrefix: 'tbnb',
                val: bncService.endpointList.TESTNET
            },
        ];

        this.selectedNetwork$ = new BehaviorSubject(this.networkMenu[0]);
    }

    setNameForAccount$(accountNumber: number, newName: string) {

    }

    getAccountNumberByName$() {

    }

    getAllAccountNames$() {

    }

    getAccountByName$() {

    }
}
