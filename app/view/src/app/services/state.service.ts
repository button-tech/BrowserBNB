import { Injectable } from '@angular/core';
import { IStorageAccount, IStorageData, NetworkType, StorageService } from './storage.service';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { BinanceService } from './binance.service';
import { NETWORK_ENDPOINT_MAPPING } from './network_endpoint_mapping';
import { distinctUntilChanged, map, mapTo, pluck, shareReplay, switchMap, switchMapTo } from 'rxjs/operators';

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
    accounts: IUiAccount[];
    currentAccount: IUiAccount;
    network: NetworkType;
    // Maintain that for correct storage update
    storageData: IStorageData;
}

export interface IUiBalance {
    bnb: string;
    bnbFiat: string;
}

export function toShotAddress(address: string): string {
    return address.substring(0, 8) + '...' + address.substring(address.length - 8, address.length);
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
    private password = '';

    emptyState: IUiState = Object.freeze({
        accounts: [],
        currentAccount: null,
        network: null,

        //
        storageData: null
    });

    selectedNetwork$: BehaviorSubject<IMenuItem>;
    uiState$: BehaviorSubject<IUiState> = new BehaviorSubject(this.emptyState);

    allBalances$: Observable<Array<any>>;
    bnbBalance$: Observable<number>;
    bnbBalanceInFiat$: Observable<number>;

    getBalancePipeline$(address: string): Observable<IUiBalance> {
        return of({
            bnb: 'pending',
            bnbFiat: 'pending'
        });
    }


    get uiState(): IUiState {
        return this.uiState$.getValue();
    }

    initState(data: IStorageData, password: string) {

        const accounts = data.accounts.map((account) => {

            const name = data.address2name[account.addressMainnet];
            const shortMainnetAddress = toShotAddress(account.addressMainnet);
            const shortTestnetAddress = toShotAddress(account.addressTestnet);

            return {
                ...account,
                name,
                shortMainnetAddress,
                shortTestnetAddress
            };
        });

        const currentAccount = accounts.find((account) => {
            return account.addressMainnet === data.selectedAddress || account.addressTestnet === data.selectedAddress;
        });

        const uiState: IUiState = {
            accounts,
            currentAccount,
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

        // this.getBalancePipeline$();

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

        // Array balances of different tokens for current account
        this.allBalances$ = this.uiState$.pipe(
            distinctUntilChanged((a: IUiState, b: IUiState) => {
                const sameAccount = (a.currentAccount === b.currentAccount);
                const sameNetwork = (a.network === b.network);
                return sameAccount && sameNetwork;
            }),
            switchMap((uiState: IUiState) => {
                const {currentAccount, network} = uiState;

                const [address, endpoint] = network === 'bnb'
                    ? [currentAccount.addressMainnet, NETWORK_ENDPOINT_MAPPING.MAINNET]
                    : [currentAccount.addressTestnet, NETWORK_ENDPOINT_MAPPING.TESTNET];

                return timer(0, 60000).pipe(
                    switchMap(() => {
                        return this.bncService.getBalance$(address, endpoint);
                    })
                );
            }),
            shareReplay(1)
        );

        this.bnbBalance$ = this.allBalances$.pipe(

        );

        this.bnbBalanceInFiat$ = this.bnbBalance$.pipe(

        );
        // this.selectedNetwork$ = new BehaviorSubject(this.networkMenu[0]);
    }
}