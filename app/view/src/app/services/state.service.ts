import {Injectable} from '@angular/core';
import {IStorageAccount, IStorageData, NetworkType, StorageService} from './storage.service';
import {BehaviorSubject, combineLatest, Observable, of, timer} from 'rxjs';
import {BinanceService} from './binance.service';
import {NETWORK_ENDPOINT_MAPPING} from './network_endpoint_mapping';
import {distinctUntilChanged, map, mapTo, pluck, shareReplay, switchMap, switchMapTo, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

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
    address: string;
    shortAddress: string;
}

export interface IUiState {
    accounts: IUiAccount[];
    currentAccount: IUiAccount;
    // Maintain that for correct storage update
    storageData: IStorageData;
}

export interface IUiBalance {
    bnb: string;
    bnbFiat: string;
}

export function toShortAddress(address: string): string {
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
        currentAccount: {
            name: '',
            address: '',
            shortAddress: '',
            addressMainnet: '',
            addressTestnet: '',
            privateKey: ''
        },
        storageData: null
    });

    selectedNetwork$: BehaviorSubject<IMenuItem>;
    uiState$: BehaviorSubject<IUiState> = new BehaviorSubject(this.emptyState);

    allBalances$: Observable<Array<any>>;
    bnbBalance$: Observable<number>;
    bnbBalanceInUsd$: Observable<number>;

    currentAddress$: Observable<string>;
    currentAddress: string;

    currentAddressShort$: Observable<string>;

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

            const address = data.selectedNetwork === 'bnb'
                ? account.addressMainnet
                : account.addressTestnet;

            const shortAddress = toShortAddress(address);

            return {
                ...account,
                name,
                address,
                shortAddress
            };
        });

        const currentAccount = accounts.find((account) => {
            return account.addressMainnet === data.selectedAddress || account.addressTestnet === data.selectedAddress;
        });

        const uiState: IUiState = {
            accounts,
            currentAccount,
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
        //     ...this.uiState.storageData
        // };
        //
        // this.uiState.accounts.push({
        //
        // });
        //
        // const newUiState = {
        //     ...this.uiState
        // };
        // this.uiState$.next(newUiState);
    }

    switchAccount(toAccount: IUiAccount): void {

        const newStorageState: IStorageData = {
            ...this.uiState.storageData,
            selectedAddress: toAccount.addressMainnet
        };

        const newUiState = {
            ...this.uiState,
            currentAccount: toAccount
        };

        this.storageService.encryptAndSave(newUiState.storageData, this.password);
        this.uiState$.next(newUiState);
    }

    switchNetwork(network: NetworkType): void {

        const newStorageState: IStorageData = {
            ...this.uiState.storageData,
            selectedNetwork: network
        };

        const newAccounts = this.uiState.accounts.map((account) => {
            const newAddress = network === 'bnb'
                ? account.addressMainnet
                : account.addressTestnet;

            return {
                ...account,
                address: newAddress,
                shortAddress: toShortAddress(newAddress)
            };
        });

        const currentAccount = newAccounts.find((account) => {
            return account.addressMainnet === this.uiState.storageData.selectedAddress ||
                account.addressTestnet === this.uiState.storageData.selectedAddress;
        });

        const newUiState: IUiState = {
            ...this.uiState,
            accounts: newAccounts,
            currentAccount
        };

        this.storageService.encryptAndSave(newUiState.storageData, this.password);
        this.uiState$.next(newUiState);
    }

    constructor(private storageService: StorageService, private bncService: BinanceService, private http: HttpClient) {

        this.currentAddress$ = this.uiState$.pipe(
            map((uiState: IUiState) => {
                const {currentAccount, storageData} = uiState;

                return storageData.selectedNetwork === 'bnb'
                    ? currentAccount.addressMainnet
                    : currentAccount.addressTestnet;
            }),
            tap((value) => {
                this.currentAddress = value;
            }),
            shareReplay(1)
        );

        this.currentAddressShort$ = this.currentAddress$.pipe(
            map((address: string) => {
                return toShortAddress(address);
            }),
            shareReplay(1)
        );

        // Array balances of different tokens for current account
        this.allBalances$ = this.uiState$.pipe(
            // TODO: simplify using current address and current endpoint
            distinctUntilChanged((a: IUiState, b: IUiState) => {
                const sameAccount = (a.currentAccount === b.currentAccount);
                const sameNetwork = (a.storageData.selectedNetwork === b.storageData.selectedNetwork);
                return sameAccount && sameNetwork;
            }),
            switchMap((uiState: IUiState) => {
                const {currentAccount, storageData} = uiState;

                const [address, endpoint] = storageData.selectedNetwork === 'bnb'
                    ? [currentAccount.addressMainnet, NETWORK_ENDPOINT_MAPPING.MAINNET]
                    : [currentAccount.addressTestnet, NETWORK_ENDPOINT_MAPPING.TESTNET];

                return timer(0, 5000).pipe(
                    switchMap(() => {
                        return this.bncService.getBalance$(address, endpoint);
                    })
                );
            }),
            shareReplay(1)
        );

        const pluckBalance = (response: any, coinSymbol: string) => {
            const balances = response.balances || [];
            const item = balances.find((x) => x.symbol === coinSymbol);
            return item ? item.free : 0;
        };

        this.bnbBalance$ = this.allBalances$.pipe(
            map((response) => pluckBalance(response, 'BNB')),
            shareReplay(1)
        );


        const bnb2usdRate$ = timer(0, 10000).pipe(
            switchMap(() => {
                return this.http.get('https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD');
            }),
            map((resp: any) => resp.USD),
            shareReplay(1)
        );

        this.bnbBalanceInUsd$ = combineLatest([this.bnbBalance$, bnb2usdRate$]).pipe(
            map((arr: any[]) => {
                const [bnb, rate] = arr;
                const fiat = (bnb * rate);
                return +((Math.floor(fiat * 100) / 100).toFixed(2));
            }),
            shareReplay(1)
        );
    }
}
