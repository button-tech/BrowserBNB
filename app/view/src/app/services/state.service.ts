import {Injectable} from '@angular/core';
import {IStorageAccount, IStorageData, NetworkType, StorageService} from './storage.service';
import {BehaviorSubject, combineLatest, concat, merge, Observable, of, Subject, timer} from 'rxjs';
import {BinanceService, IBalance} from './binance.service';
import {NETWORK_ENDPOINT_MAPPING} from './network_endpoint_mapping';
import {
    distinctUntilChanged,
    map,
    mapTo,
    mergeAll,
    pluck,
    shareReplay,
    startWith,
    switchMap,
    switchMapTo,
    take,
    tap
} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {getAddressFromPrivateKey, getPrivateKeyFromMnemonic} from './binance-crypto';

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

const emptyState: IUiState = Object.freeze({
    accounts: [],
    currentAccount: {
        name: '',
        address: '',
        shortAddress: '',
        addressMainnet: '',
        addressTestnet: '',
        privateKey: '',
        index: 0
    },
    storageData: null
});

const basicNetworkSttate: IMenuItem = Object.freeze({
    val: ' https://dex.binance.org',
    networkPrefix: 'bnb',
    label: 'mainnet',
});

export interface IUiBalance {
    bnb: string;
    bnbFiat: string;
}

export interface IMarketRates {
    symbol: string;
    baseAssetName: string;
    quoteAssetName: string;
    priceChange: string;
    priceChangePercent: string;
    prevClosePrice: string;
    lastPrice: string;
    lastQuantity: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    openTime: any;
    closeTime: any;
    firstId: string;
    lastId: string;
    bidPrice: string;
    bidQuantity: string;
    askPrice: string;
    askQuantity: string;
    weightedAvgPrice: string;
    volume: string;
    quoteVolume: string;
    count: number;
}

export function toShortAddress(address: string): string {
    return address.substring(0, 8) + '...' + address.substring(address.length - 8, address.length);
}

@Injectable()
export class StateService {

    private password = '';

    selectedNetwork$: BehaviorSubject<IMenuItem> = new BehaviorSubject(basicNetworkSttate);
    uiState$: BehaviorSubject<IUiState> = new BehaviorSubject(emptyState);

    allBalances$: Observable<IBalance[]>;
    bnbBalance$: Observable<number>;
    bnbBalanceInUsd$: Observable<number>;
    marketRates$: Observable<IMarketRates[]>;

    currentAddress$: Observable<string>;
    currentAddress: string;

    currentAddressShort$: Observable<string>;

    currentEndpoint$: Observable<NETWORK_ENDPOINT_MAPPING>;
    currentEndpoint: NETWORK_ENDPOINT_MAPPING;

    history$: Observable<any>;

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

        const val = data.selectedNetworkEndpoint;
        const networkPrefix = data.selectedNetwork;
        const label = networkPrefix === 'bnb' ? 'mainnet' : 'testnet';
        const newSelectedNetwork: IMenuItem = {
            networkPrefix,
            val,
            label
        };

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
        this.selectedNetwork$.next(newSelectedNetwork);
    }

    resetState() {
        this.uiState$.next(emptyState);
        this.password = '';
    }

    addAccount(): void {

        const seedPhrase = this.uiState.storageData.seedPhrase;
        const indexes = this.uiState.storageData.accounts.map(a => a.index);
        const index = Math.max(...indexes) + 1;

        // Prepare account
        const privateKey = getPrivateKeyFromMnemonic(seedPhrase, index);

        // tslint:disable-next-line:max-line-length
        // offer caution gift cross surge pretty orange during eye soldier popular holiday mention east eight office fashion ill parrot vault rent devote earth cousins
        const addressMainnet = getAddressFromPrivateKey(privateKey, 'bnb');
        const addressTestnet = getAddressFromPrivateKey(privateKey, 'tbnb');

        const name = `Account ${index + 1}`;
        const address2name = {
            [addressMainnet]: name,
            [addressTestnet]: name
        };

        //
        const newStorageState: IStorageData = {
            ...this.uiState.storageData,
            address2name: {
                ...this.uiState.storageData.address2name,
                ...address2name
            },
            accounts: [...this.uiState.storageData.accounts, {
                addressMainnet,
                addressTestnet,
                privateKey,
                index
            }]
        };

        this.storageService.encryptAndSave(newStorageState, this.password);

        const address = this.uiState.storageData.selectedNetwork === 'bnb'
            ? addressMainnet
            : addressTestnet;


        this.uiState.storageData = newStorageState;
        this.uiState.accounts.push({
            name,
            address,
            shortAddress: toShortAddress(address),
            addressMainnet,
            addressTestnet,
            privateKey,
            index,
        });

        this.uiState$.next(this.uiState);
    }

    switchAccount(toAccount: IUiAccount): void {

        const newStorageState: IStorageData = {
            ...this.uiState.storageData,
            selectedAddress: toAccount.addressMainnet
        };
        this.storageService.encryptAndSave(newStorageState, this.password);


        const newUiState = {
            ...this.uiState,
            currentAccount: toAccount,
            storageData: newStorageState
        };
        this.uiState$.next(newUiState);
    }

    switchNetwork(network: NetworkType): void {

        const newStorageState: IStorageData = {
            ...this.uiState.storageData,
            selectedNetwork: network
        };
        this.storageService.encryptAndSave(newStorageState, this.password);

        const val = this.uiState.storageData.selectedNetworkEndpoint;
        const networkPrefix = network;
        const label = networkPrefix === 'bnb' ? 'mainnet' : 'testnet';
        const newSelectedNetwork: IMenuItem = {
            networkPrefix,
            val,
            label
        };

        this.selectedNetwork$.next(newSelectedNetwork);

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
            currentAccount,
            storageData: newStorageState
        };

        this.uiState$.next(newUiState);
    }

    //
    // refreshHistory$ = new Subject<any>();
    // refreshHistory() {
    //     this.refreshHistory$.next();
    // }
    //

    showHistoryLoadingIndicator$ = new BehaviorSubject(true);

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

        this.currentEndpoint$ = this.uiState$.pipe(
            map((uiState: IUiState) => {
                return uiState.storageData.selectedNetwork === 'bnb'
                    ? NETWORK_ENDPOINT_MAPPING.MAINNET
                    : NETWORK_ENDPOINT_MAPPING.TESTNET;
            }),
            tap((value) => {
                this.currentEndpoint = value;
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

        const pluckBalance = (balances: IBalance[], coinSymbol: string) => {
            const item = balances.find((x) => x.symbol === coinSymbol);
            return item ? +item.free : 0;
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

        this.marketRates$ = timer(0, 12000).pipe(
            switchMap(() => {
                return this.http.get('https://dex.binance.org/api/v1/ticker/24hr');
            }),
            map((resp: IMarketRates[]) => resp)
        );

        // offer caution gift cross surge pretty orange during eye soldier popular holiday mention east eight office fashion ill parrot vault rent devote earth cousin
        // const endpoint = 'dex.binance.org';
        // const address = 'bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu';

        this.history$ = combineLatest([this.currentAddress$, this.currentEndpoint$]).pipe(
            tap(() => {
                this.showHistoryLoadingIndicator$.next(true);
            }),
            switchMap((x) => {
                const [address, endpoint] = x;
                return concat(
                    bncService.getHistory$(address, endpoint).pipe(
                        tap(() => {
                            this.showHistoryLoadingIndicator$.next(false);
                        })
                    ),
                    timer(0, 10000).pipe(
                        switchMap(() => {
                            return bncService.getHistory$(address, endpoint);
                        })
                    )
                );
            }),
            shareReplay(1)
        );

        // Simple pipeline
        //
        // const historyRefresh$ = combineLatest([this.currentAddress$, this.currentEndpoint$]);
        // this.history$ = historyRefresh$.pipe(
        //     tap(() => {
        //         this.showHistoryLoadingIndicator$.next(true);
        //     }),
        //     switchMap((x) => {
        //         const [address, endpoint] = x;
        //         return bncService.getHistory$(address, endpoint);
        //     }),
        //     tap(() => {
        //         this.showHistoryLoadingIndicator$.next(false);
        //     }),
        //     shareReplay(1)
        // );
        //
    }
}
