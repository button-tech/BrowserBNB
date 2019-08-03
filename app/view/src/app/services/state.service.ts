import {Injectable} from '@angular/core';
import {IStorageAccount, IStorageData, NetworkType, StorageService} from './storage.service';
import {BehaviorSubject, combineLatest, concat, merge, Observable, of, Subject, timer} from 'rxjs';
import {BinanceService, IBalance} from './binance.service';
import {NETWORK_ENDPOINT_MAPPING} from './network_endpoint_mapping';
import {
    distinctUntilChanged,
    map,
    shareReplay,
    switchMap,
    tap
} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {getAddressFromPrivateKey, getPrivateKeyFromMnemonic} from './binance-crypto';
import {rawTokensImg} from '../constants';

export interface ITransaction {
    Amount: number;
    AddressTo: string;
    AddressFrom: string;
    Memo: string;
    Symbol: string;
    name: string;
    mapppedName: string;
    rate2usd: number;
}

export interface ITokenInfo {
    balance: string;
    balance2usd: number;
    balance2usdStr: string;
    image: string;
    mappedName: string;
    name: string;
    symbol: string;
    rate2usd: number;
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
    val: 'https://dex.binance.org',
    networkPrefix: 'bnb',
    label: 'mainnet',
});
const basicTransactionState: ITransaction = {
    Amount: 0,
    AddressTo: '',
    AddressFrom: '',
    Memo: '',
    Symbol: 'BNB',
    name: 'Binance Coin',
    mapppedName: 'BNB',
    rate2usd: 0
};

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
    bnb2usdRate$: Observable<number>;
    currentAddress$: Observable<string>;
    currentAddress: string;
    currentAddressShort$: Observable<string>;

    tokens$: Observable<ITokenInfo[]>;

    currentEndpoint$: Observable<NETWORK_ENDPOINT_MAPPING>;
    currentEndpoint: NETWORK_ENDPOINT_MAPPING;

    history$: Observable<any>;
    historyDetails$: Observable<any>;

    currentTransaction: BehaviorSubject<ITransaction> = new BehaviorSubject<ITransaction>(basicTransactionState);
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

        this.bnb2usdRate$ = bnb2usdRate$;

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

        this.tokens$ = combineLatest([this.allBalances$, this.marketRates$, bnb2usdRate$])
            .pipe(
                map((x: any[]) => {
                    const [balances, marketRates, bnb2usd] = x;
                    const imagesUrls = JSON.parse(rawTokensImg);
                    let finalBalances = [];
                    balances.forEach((token) => {
                        const marketTickerForCurrentToken = marketRates.find(o => o.baseAssetName === token.symbol);
                        const tokensDetailsForCurrentToken = imagesUrls.find(o => o.symbol === token.symbol);
                        const isOk =
                            marketTickerForCurrentToken !== undefined
                            && tokensDetailsForCurrentToken !== undefined
                            && tokensDetailsForCurrentToken.name !== undefined
                            && tokensDetailsForCurrentToken.mappedAsset !== undefined
                            && token.symbol !== 'BNB';

                        if (isOk) {
                            finalBalances.push({
                                'symbol': token.symbol,
                                'balance2usd': Number(marketTickerForCurrentToken.lastPrice) * bnb2usd * Number(token.free),
                                'balance': Number(token.free),
                                'image': tokensDetailsForCurrentToken.image,
                                'name': tokensDetailsForCurrentToken.name,
                                'mappedName': tokensDetailsForCurrentToken.mappedAsset,
                                'rate2usd': Number(marketTickerForCurrentToken.lastPrice) * bnb2usd,
                            });
                        } else if (token.symbol !== 'BNB'
                            && tokensDetailsForCurrentToken
                            && tokensDetailsForCurrentToken.name !== undefined
                            && tokensDetailsForCurrentToken.mappedAsset !== undefined
                        ) {
                            finalBalances.push({
                                'symbol': token.symbol,
                                'balance2usd': 0,
                                'balance': Number(token.free),
                                'image': '',
                                'name': tokensDetailsForCurrentToken.name,
                                'mappedName': tokensDetailsForCurrentToken.mappedAsset,
                                'rate2usd': 0,
                            });
                        } else if (tokensDetailsForCurrentToken &&
                            tokensDetailsForCurrentToken.name === undefined &&
                            tokensDetailsForCurrentToken.mappedAsset !== undefined) {
                            finalBalances.push({
                                'symbol': token.symbol,
                                'balance2usd': 0,
                                'balance': Number(token.free),
                                'image': '',
                                'name': '',
                                'mappedName': tokensDetailsForCurrentToken.mappedAsset,
                                'rate2usd': 0,
                            });
                        } else if (tokensDetailsForCurrentToken
                            && tokensDetailsForCurrentToken.name !== undefined
                            && tokensDetailsForCurrentToken.mappedAsset === undefined) {
                            finalBalances.push({
                                'symbol': token.symbol,
                                'balance2usd': 0,
                                'balance': Number(token.free),
                                'image': '',
                                'name': tokensDetailsForCurrentToken.name,
                                'mappedName': '',
                                'rate2usd': 0,
                            });
                        } else if (!tokensDetailsForCurrentToken) {
                            finalBalances.push({
                                'symbol': token.symbol,
                                'balance2usd': 0,
                                'balance': Number(token.free),
                                'image': '',
                                'name': token.symbol,
                                'mappedName': token.symbol,
                                'rate2usd': 0,
                            });
                        }
                    });
                    return finalBalances.sort((a, b) => {
                        const usdBalanceDiff = b.balance2usd - a.balance2usd;
                        if (usdBalanceDiff === 0) {
                            const balanceDiff = b.balance - a.balance;
                            if (balanceDiff === 0) {
                                return a.symbol > b.symbol ? 1 : -1;
                            }
                            return balanceDiff;
                        }
                        return usdBalanceDiff;
                    });
                }),
                shareReplay(1));
    }

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
            const address = data.selectedNetwork === 'bnb'
                ? account.addressMainnet
                : account.addressTestnet;

            const shortAddress = toShortAddress(address);

            return {
                ...account,
                address,
                shortAddress
            };
        });

        const networkPrefix = data.selectedNetwork;
        const val = networkPrefix === 'bnb'
            ? NETWORK_ENDPOINT_MAPPING.MAINNET
            : NETWORK_ENDPOINT_MAPPING.TESTNET;

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
        this.addAccountFromSeed(seedPhrase);
    }

    // UI, index and logical index...
    addAccountFromSeed(seedPhrase: string, hdWalletIndex?: number): void {

        if (hdWalletIndex === undefined) {
            const indexes = this.uiState.storageData.accounts.map(a => a.index);
            hdWalletIndex = Math.max(...indexes) + 1;
        }

        // Prepare account
        const privateKey = getPrivateKeyFromMnemonic(seedPhrase, hdWalletIndex);

        // tslint:disable-next-line:max-line-length
        // offer caution gift cross surge pretty orange during eye soldier popular holiday mention east eight office fashion ill parrot vault rent devote earth cousins
        const addressMainnet = getAddressFromPrivateKey(privateKey, 'bnb');
        const addressTestnet = getAddressFromPrivateKey(privateKey, 'tbnb');

        const maxUiIndex = this.uiState.storageData.accounts.length;
        const name = `Account ${maxUiIndex + 1}`;

        const newStorageState: IStorageData = {
            ...this.uiState.storageData,
            accounts: [...this.uiState.storageData.accounts, {
                addressMainnet,
                addressTestnet,
                privateKey,
                index: hdWalletIndex,
                name
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
            index: hdWalletIndex,
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

        const networkPrefix = network;
        const val = networkPrefix === 'bnb'
            ? NETWORK_ENDPOINT_MAPPING.MAINNET
            : NETWORK_ENDPOINT_MAPPING.TESTNET;

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
}
