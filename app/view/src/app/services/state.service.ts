import {Injectable, OnDestroy} from '@angular/core';
import {IStorageAccount, IStorageData, NetworkType, StorageService} from './storage.service';
import * as passworder from 'browser-passworder';
import {BehaviorSubject, combineLatest, from, Observable, of, Subscription} from 'rxjs';
import {filter, map, startWith, switchMap, take, tap} from 'rxjs/operators';
import {BinanceService} from './binance.service';
import {getPrivateKeyFromMnemonic, getAddressFromPrivateKey} from './binance-crypto';
import {NETWORK_ENDPOINT_MAPPING} from './network_endpoint_mapping';

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

export interface IUiAccount extends IStorageAccount {
    name: string;
    shortMainnetAddress: string;
    shortTestnetAddress: string;
}

export interface IUiState {
    accounts: IUiAccount[],
    activeAccount: IUiAccount,
    network: NetworkType,

    // Maintain that for correct storage update
    storageData: IStorageData
}

export interface IUiBalance {
    bnb: string,
    bnbFiat: string
}

@Injectable()
export class StateService {

    // TODO: should be used only for UI, for traking purposes we should define another model
    // currentTransaction: ITransaction = {
    //     'Amount': 0,
    //     'AddressTo': '',
    //     'AddressFrom': '',
    //     'Memo': '',
    //     'Symbol': ''
    // };

    emptyState: IUiState = Object.freeze({
        accounts: [],
        activeAccount: null,
        network: null,

        //
        storageData: null
    });

    selectedNetwork$: BehaviorSubject<IMenuItem>;
    uiState$: BehaviorSubject<IUiState> = new BehaviorSubject(this.emptyState);

    balance$: Observable<IUiBalance> = of({
        bnb: 'pending',
        bnbFiat: 'pending'
    });

    getBalancePipeline$(address: string): Observable<IUiBalance> {
        return of({
            bnb: 'pending',
            bnbFiat: 'pending'
        });
    }


    get uiState(): IUiState {
        return this.uiState$.getValue();
    }

    private password: string = '';

    static toShotAddress(address: string): string {
        return address.substring(0, 8) + '...' + address.substring(address.length - 8, address.length);
    }

    initState(data: IStorageData, password: string) {

        const accounts = data.accounts.map((account) => {

            const name = data.address2name[account.addressMainnet];
            const shortMainnetAddress = StateService.toShotAddress(account.addressMainnet);
            const shortTestnetAddress = StateService.toShotAddress(account.addressTestnet);

            return {
                ...account,
                name,
                shortMainnetAddress,
                shortTestnetAddress
            };
        });

        const activeAccount = accounts.find((account) => {
            return account.addressMainnet === data.selectedAddress || account.addressTestnet === data.selectedAddress;
        });

        const uiState: IUiState = {
            accounts,
            activeAccount: activeAccount,
            network: data.selectedNetwork,
            storageData: data
        };

        this.uiState$.next(uiState);
        this.password = password;
    }

    resetState() {
        this.uiState$.next(this.emptyState);
        this.password = '';
    }

    addAccount(): void {
        // Use hd wallet ...
        // const newStorageState: IStorageData = {
        //     ...this.uiState.storageData,
        //     selectedAddress: toAccount.addressMainnet
        // };
        //
        // const newUiState = {
        //     ...this.uiState,
        //     activeAccount: toAccount
        // };
        // this.uiState$.next(newUiState);
        //
        // this.storageService.encryptAndSave(newStorageState, this.password);
    }

    switchAccount(toAccount: IUiAccount): void {

        const newStorageState: IStorageData = {
            ...this.uiState.storageData,
            selectedAddress: toAccount.addressMainnet
        };

        const newUiState = {
            ...this.uiState,
            activeAccount: toAccount
        };
        this.uiState$.next(newUiState);

        //this.getBalancePipeline$();

        this.storageService.encryptAndSave(newStorageState, this.password);
    }

    switchNetwork(network: NetworkType): void {

        const newStorageState: IStorageData = {
            ...this.uiState.storageData,
            selectedNetwork: network
        };

        const newUiState = {
            ...this.uiState,
            selectedNetwork: network
        };
        this.uiState$.next(newUiState);

        this.storageService.encryptAndSave(newStorageState, this.password);
    }

    constructor(private storageService: StorageService, private bncService: BinanceService) {

        this.networkMenu = [
            {
                label: 'MAINNET',
                networkPrefix: 'bnb',
                val: NETWORK_ENDPOINT_MAPPING.MAINNET
            },
            {
                label: 'TESTNET',
                networkPrefix: 'tbnb',
                val: NETWORK_ENDPOINT_MAPPING.TESTNET
            },
        ];

        // this.selectedNetwork$ = new BehaviorSubject(this.networkMenu[0]);
    }
}
