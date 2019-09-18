import {Injectable} from '@angular/core';
import {IStorageAccount, IStorageData, NetworkType, StorageService} from './storage.service';
import {BehaviorSubject, combineLatest, concat, NEVER, Observable, timer} from 'rxjs';
import {BinanceService, IBalance} from './binance.service';
import {NETWORK_ENDPOINT_MAPPING} from './network_endpoint_mapping';
import {catchError, distinctUntilChanged, filter, map, shareReplay, startWith, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {getAddressFromPrivateKey, getPrivateKeyFromMnemonic} from './binance-crypto';
import {rawTokensImg} from '../constants';
import {CoursesService, CurrencySymbols} from "./courses.service";

export interface ITransaction {
    Amount: number;
    IsAmountEnteredInUSD: boolean;

    AddressTo: string;
    AddressFrom: string;
    Memo: string;
    Symbol: string;
    name: string;
    mapppedName: string;
    rate2fiat: number;
}

export interface ITokenInfo {
    balance: string;
    balance2usd: number;
    balance2usdStr: string;
    image: string;
    mappedName: string;
    name: string;
    symbol: string;
    rate2fiat: number;
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
    val: 'https://dex.binance.org/',
    networkPrefix: 'bnb',
    label: 'mainnet',
});
const basicTransactionState: ITransaction = {
    Amount: 0,
    IsAmountEnteredInUSD: false,
    AddressTo: '',
    AddressFrom: '',
    Memo: '',
    Symbol: 'BNB',
    name: 'Binance Coin',
    mapppedName: 'BNB',
    rate2fiat: 0
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

export interface IFixedFeeParams {
    msg_type: string;
    fee: number;
    fee_for: number;
}

export interface IDexFeeField {
    fee_name: string;
    fee_value: number;
}

export interface ITransferFees {
    msg_type: string;
    fee: number;
    fee_for: number;
    fixed_fee_params: IFixedFeeParams;
    multi_transfer_fee?: number;
    lower_limit_as_multi?: number;
    dex_fee_fields: IDexFeeField[];
}

export function toShortAddress( address: string ): string {
    return address.substring(0, 8) + '...' + address.substring(address.length - 8, address.length);
}

@Injectable()
export class StateService {

    private password = '';
    baseCurrency$: Observable<CurrencySymbols>;

    selectedNetwork$: BehaviorSubject<IMenuItem> = new BehaviorSubject(basicNetworkSttate);
    uiState$: BehaviorSubject<IUiState> = new BehaviorSubject(emptyState);

    allBalances$: Observable<IBalance[]>;
    bnbBalance$: Observable<number>;
    bnbBalanceInFiat$: Observable<number>;
    marketRates$: Observable<IMarketRates[]>;
    bnb2fiatRate$: Observable<number>;
    currentAddress$: Observable<string>;
    currentAddress: string;
    currentAddressShort$: Observable<string>;

    tokens$: Observable<ITokenInfo[]>;

    currentEndpoint$: Observable<NETWORK_ENDPOINT_MAPPING>;
    currentEndpoint: NETWORK_ENDPOINT_MAPPING;

    history$: Observable<any>;
    historyDetails$: Observable<any>;

    transferFees$: Observable<any>;
    simpleFee$: Observable<any>;

    ws: WebSocket;

    currentTransaction: BehaviorSubject<ITransaction> = new BehaviorSubject<ITransaction>(basicTransactionState);
    showHistoryLoadingIndicator$ = new BehaviorSubject(true);

    constructor( private storageService: StorageService,
                 private bncService: BinanceService,
                 private http: HttpClient,
                 private courses: CoursesService ) {

        this.currentAddress$ = this.uiState$.pipe(
            map(( uiState: IUiState ) => {
                const {currentAccount, storageData} = uiState;

                return storageData.selectedNetwork === 'bnb'
                    ? currentAccount.addressMainnet
                    : currentAccount.addressTestnet;
            }),
            tap(( value ) => {
                this.currentAddress = value;
            }),
            shareReplay(1)
        );

        this.currentEndpoint$ = this.uiState$.pipe(
            map(( uiState: IUiState ) => {
                return uiState.storageData.selectedNetwork === 'bnb'
                    ? NETWORK_ENDPOINT_MAPPING.MAINNET
                    : NETWORK_ENDPOINT_MAPPING.TESTNET;
            }),
            tap(( value ) => {
                this.currentEndpoint = value;
            }),
            shareReplay(1)
        );

        this.currentAddressShort$ = this.currentAddress$.pipe(
            map(( address: string ) => {
                return toShortAddress(address);
            }),
            shareReplay(1)
        );

        // Array balances of different tokens for current account
        this.allBalances$ = this.uiState$.pipe(
            // TODO: simplify using current address and current endpoint
            distinctUntilChanged(( a: IUiState, b: IUiState ) => {
                const sameAccount = (a.currentAccount === b.currentAccount);
                const sameNetwork = (a.storageData.selectedNetwork === b.storageData.selectedNetwork);
                return sameAccount && sameNetwork;
            }),
            switchMap(( uiState: IUiState ) => {
                const {currentAccount, storageData} = uiState;

                const [address, endpoint] = storageData.selectedNetwork === 'bnb'
                    ? [currentAccount.addressMainnet, NETWORK_ENDPOINT_MAPPING.MAINNET]
                    : [currentAccount.addressTestnet, NETWORK_ENDPOINT_MAPPING.TESTNET];

                return timer(0, 10000).pipe(
                    switchMap(() => {
                        return this.bncService.getBalance$(address, endpoint);
                    })
                );
            }),
            shareReplay(1)
        );

        const pluckBalance = ( balances: IBalance[], coinSymbol: string ) => {
            const item = balances.find(( x ) => x.symbol === coinSymbol);
            return item ? +item.free : 0;
        };

        this.bnbBalance$ = this.allBalances$.pipe(
            map(( response ) => pluckBalance(response, 'BNB')),
            shareReplay(1)
        );

        const timerFees$ = timer(0, 120000);

        this.transferFees$ = combineLatest([this.selectedNetwork$, timerFees$]).pipe(
            switchMap(( x: any[] ) => {
                const [networkMenuItem] = x;
                const endpoint = networkMenuItem.val;
                return this.http.get(`${endpoint}api/v1/fees`);
            }),
            shareReplay(1)
        );

        const pluckFee = ( response: ITransferFees[] ) => {
            const item = response.find(( x ) => x.multi_transfer_fee >= 0);
            return item.fixed_fee_params.fee / 100000000;
        };

        this.simpleFee$ = this.transferFees$.pipe(
            map(( response: ITransferFees[] ) => {
                return pluckFee(response);
            }),
            shareReplay(1)
        );
        // TODO: think about using it
        this.simpleFee$.subscribe();

        //
        // Rates that we get using poling
        //

        // if (this.uiState$.getValue().storageData === null) {
        //     this.baseCurrency.next(CurrencySymbols.USD);
        // } else {
        //     this.baseCurrency.next(this.uiState$.getValue().storageData.baseFiatCurrency);
        // }
        //
        this.baseCurrency$ = this.uiState$.pipe(
            filter(( uiState ) => uiState.storageData !== null),
            map(( uiState ) => {
                return uiState.storageData.baseFiatCurrency;
            }),
            startWith(CurrencySymbols.USD),
            shareReplay(1),
        );

        this.bnb2fiatRate$ =
            combineLatest(
                [timerFees$,
                    this.baseCurrency$])
                .pipe(
                    switchMap(( x: any[] ) => {
                        const [_, baseCurrency] = x;
                        return this.courses.getBinanceRate$(baseCurrency);
                    }),
                    catchError(() => {
                        return NEVER;
                    }),
                    map(( rawRate: string ) => {
                        return +rawRate;
                    }),
                    shareReplay(1),
                );

        // const bnb2usdRateWs$ = this.createObservableSocket("wss://explorer.binance.org/ws/chain")
        //   .pipe(
        //     map((wsData: any) => {
        //         return Number(JSON.parse(wsData).bnbPrice2USD);
        //     })
        //   );
        //
        // this.bnb2fiatRate$ = bnb2usdRateWs$;

        // this.bnb2fiatRate$.subscribe(
        //   bnbPrice2USD => {},
        //   err => console.log('err'),
        //   () =>  console.log( 'The observable stream is complete')
        // );

        this.bnbBalanceInFiat$ = combineLatest([this.bnbBalance$, this.bnb2fiatRate$]).pipe(
            map(( arr: any[] ) => {
                const [bnb, rate] = arr;
                const fiat = (bnb * rate);
                return +((Math.floor(fiat * 100) / 100).toFixed(2));
            }),
            shareReplay(1)
        );

        this.marketRates$ = timer(0, 24000).pipe(
            switchMap(() => {
                return this.http.get('https://dex.binance.org/api/v1/ticker/24hr');
            }),
            map(( resp: IMarketRates[] ) => resp)
        );

        this.history$ = combineLatest([this.currentAddress$, this.currentEndpoint$]).pipe(
            tap(() => {
                this.showHistoryLoadingIndicator$.next(true);
            }),
            switchMap(( x ) => {
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

        this.tokens$ = combineLatest([this.allBalances$, this.marketRates$, this.bnb2fiatRate$])
            .pipe(
                map(( x: any[] ) => {
                    const [balances, marketRates, bnb2usd] = x;
                    const imagesUrls = JSON.parse(rawTokensImg);
                    const finalBalances = [];

                    balances.forEach(( token ) => {
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

                    return finalBalances.sort(( a, b ) => {
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

    createObservableSocket( url: string ): Observable<any> {
        this.ws = new WebSocket(url);

        return new Observable(
            observer => {

                this.ws.onmessage = ( event ) => observer.next(event.data);

                this.ws.onerror = ( event ) => observer.error(event);

                this.ws.onclose = () => observer.complete();

                return () => this.ws.close(1000, "The user disconnected");
            }
        );
    }

    get uiState(): IUiState {
        return this.uiState$.getValue();
    }

    initState( data: IStorageData, password: string ) {

        const accounts = data.accounts.map(( account ) => {
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

        const currentAccount = accounts.find(( account ) => {
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

    selectBaseFiatCurrency( baseFiatCurrency: CurrencySymbols ) {
        const newStorageState: IStorageData = {
            ...this.uiState.storageData,
            baseFiatCurrency
        };
        this.storageService.encryptAndSave(newStorageState, this.password);
        const newUiState = {
            ...this.uiState,
            storageData: newStorageState
        };
        this.uiState$.next(newUiState);
    }

    renameAccount( accountIdx: number, newName: string ): void {

        this.uiState.storageData.accounts[accountIdx].name = newName;
        const newStorageState: IStorageData = {
            ...this.uiState.storageData,
        };
        this.storageService.encryptAndSave(newStorageState, this.password);

        this.uiState.accounts[accountIdx].name = newName;
        const newUiState = {
            ...this.uiState,
            storageData: newStorageState
        };
        this.uiState$.next(newUiState);
    }

    removeAccount( account: IUiAccount ): void {

        if (this.uiState.accounts.length > 0) {
        const newAccounts = this.uiState.storageData.accounts.filter(( accountToRemove ) => accountToRemove.index !== account.index);
        const newAccountsUI = this.uiState.accounts.filter(( accountToRemove ) => accountToRemove.index !== account.index);
        let accountToPick = 0;
        if (account.address === this.uiState.accounts[0].address && this.uiState.storageData.accounts.length > 1) {
           accountToPick = 1;
        } else if (this.uiState.storageData.accounts.length <= 1) {
            this.storageService.reset();
            return;
        }

        const newStorageData: IStorageData = {
            seedPhrase: this.uiState.storageData.seedPhrase,
            accounts: newAccounts,
            selectedAddress: this.uiState.storageData.accounts[accountToPick].addressMainnet,
            selectedNetwork: this.uiState.storageData.selectedNetwork,
            selectedNetworkEndpoint:   this.uiState.storageData.selectedNetworkEndpoint,
            baseFiatCurrency: this.uiState.storageData.baseFiatCurrency,
            customNetworkEndpoints: this.uiState.storageData.customNetworkEndpoints
        };

        const newUiState: IUiState = {
                accounts: newAccountsUI,
                currentAccount: this.uiState.accounts[accountToPick],
                storageData: newStorageData
        };

        this.storageService.encryptAndSave(newStorageData, this.password);
        this.uiState$.next(newUiState);
        } else {
            this.storageService.reset();
        }
    }

    addAccount(): void {
        const seedPhrase = this.uiState.storageData.seedPhrase;
        this.addAccountFromSeed(seedPhrase);
    }

    // UI, index and logical index...
    addAccountFromSeed( seedPhrase: string, hdWalletIndex?: number ): void {

        if (hdWalletIndex === undefined) {
            const indexes = this.uiState.storageData.accounts.map(a => a.index);
            hdWalletIndex = Math.max(...indexes) + 1;
        }

        // Prepare account
        const privateKey = getPrivateKeyFromMnemonic(seedPhrase, hdWalletIndex);

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

    switchAccount( toAccount: IUiAccount ): void {

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

    switchNetwork( network: NetworkType ): void {

        const networkPrefix = network;
        const val = networkPrefix === 'bnb'
            ? NETWORK_ENDPOINT_MAPPING.MAINNET
            : NETWORK_ENDPOINT_MAPPING.TESTNET;

        const newStorageState: IStorageData = {
            ...this.uiState.storageData,
            selectedNetwork: network,
            selectedNetworkEndpoint: val
        };

        this.storageService.encryptAndSave(newStorageState, this.password);

        const label = networkPrefix === 'bnb' ? 'mainnet' : 'testnet';
        const newSelectedNetwork: IMenuItem = {
            networkPrefix,
            val,
            label
        };

        this.selectedNetwork$.next(newSelectedNetwork);

        const newAccounts = this.uiState.accounts.map(( account ) => {
            const newAddress = network === 'bnb'
                ? account.addressMainnet
                : account.addressTestnet;

            return {
                ...account,
                address: newAddress,
                shortAddress: toShortAddress(newAddress)
            };
        });

        const currentAccount = newAccounts.find(( account ) => {
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

    switchNetworkCustom( network: NetworkType, val: string ): void {
        const newStorageState: IStorageData = {
            ...this.uiState.storageData,
            selectedNetwork: network,
            selectedNetworkEndpoint: val
        };
        this.storageService.encryptAndSave(newStorageState, this.password);

        const networkPrefix = network;
        let label;
        if (network === 'bnb') {
            label = 'mainnet';
        } else if (network === 'tbnb') {
            label = 'testnet';
        }

        const newSelectedNetwork: IMenuItem = {
            networkPrefix,
            val,
            label
        };

        this.selectedNetwork$.next(newSelectedNetwork);

        const newAccounts = this.uiState.accounts.map(( account ) => {
            const newAddress = network === 'bnb'
                ? account.addressMainnet
                : account.addressTestnet;

            return {
                ...account,
                address: newAddress,
                shortAddress: toShortAddress(newAddress)
            };
        });

        const currentAccount = newAccounts.find(( account ) => {
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
