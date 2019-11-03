import {Injectable} from '@angular/core';
import {BlockchainType, IStorageAccount, IStorageData, NetworkType, StorageService} from './storage.service';
import {BehaviorSubject, combineLatest, concat, NEVER, Observable, of, timer} from 'rxjs';
import {BinanceService, IBalance} from './binance.service';
import {NETWORK_ENDPOINT_MAPPING} from './network_endpoint_mapping';
import {catchError, distinctUntilChanged, filter, map, shareReplay, startWith, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {getAddressFromPrivateKey, getPrivateKeyFromMnemonic} from './binance-crypto';
import {CurrencySymbols, tokenDetailsList} from '../constants';
import {CoursesService} from "./courses.service";
import {CosmosService} from "./cosmos.service";

export interface ITransaction {
    Amount: number;
    IsAmountEnteredInUSD: boolean;
    AddressTo: string;
    AddressFrom: string;
    Memo: string;
    Symbol: string;
    name: string;
    mappedName: string;
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
    rate2usd: number;
}

// TODO: rename to network interface
export interface INetworkMenuItem {
    label: string;
    val: string;
    networkPrefix: NetworkType;
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

const basicNetworkState: INetworkMenuItem = Object.freeze({
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
    mappedName: 'BNB',
    rate2fiat: 0
};

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

function storageAccounts2uiAccounts(storageAccounts: IStorageAccount[], network: NetworkType): IUiAccount[] {
    return storageAccounts.map((account) => {
        const address = network === 'bnb' ? account.addressMainnet : account.addressTestnet;
        const shortAddress = toShortAddress(address);
        return {
            ...account,
            address,
            shortAddress
        };
    });
}

export function toShortAddress(address: string): string {
    return address.substring(0, 8) + '...' + address.substring(address.length - 8, address.length);
}

@Injectable()
export class StateService {

    private password = '';
    baseCurrency$: Observable<CurrencySymbols>;

    selectedBlockchain$: BehaviorSubject<BlockchainType> = new BehaviorSubject('binance');
    selectedNetwork$: BehaviorSubject<INetworkMenuItem> = new BehaviorSubject(basicNetworkState);
    uiState$: BehaviorSubject<IUiState> = new BehaviorSubject(emptyState);

    allBalances$: Observable<IBalance[]>;
    bnbBalance$: Observable<number>;
    bnbBalanceInFiat$: Observable<number>;
    marketRates$: Observable<IMarketRates[]>;
    bnb2fiatRate$: Observable<number>;
    currentAddress$: Observable<string>;
    currentAddress: string;
    currentAddressShort$: Observable<string>;

    // currentBlockchain: string;

    tokens$: Observable<ITokenInfo[]>;

    currentEndpoint$: Observable<NETWORK_ENDPOINT_MAPPING>;
    currentEndpoint: NETWORK_ENDPOINT_MAPPING;

    history$: Observable<any>;
    historyDetails$: Observable<any>;
    simpleFee$: Observable<number>;

    // disable since isn't used for now
    // ws: WebSocket;

    showHistoryLoadingIndicator$ = new BehaviorSubject(true);

    constructor(private storageService: StorageService,
                private bncService: BinanceService,
                private http: HttpClient,
                private courses: CoursesService,
                private cosmosService: CosmosService) {

        this.currentAddress$ = this.uiState$.pipe(
            map((uiState: IUiState) => {
                const {currentAccount, storageData} = uiState;

                return storageData.selectedNetwork === 'bnb' || storageData.selectedNetwork === 'cosmos'
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
                if (uiState.storageData.selectedNetwork === 'cosmos') {
                    return NETWORK_ENDPOINT_MAPPING.MAINNET_COSMOS;
                }

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

                return timer(0, 10000).pipe(
                    switchMap(() => {

                        if (storageData.selectedBlockchain === 'binance') {

                            return this.bncService.getBalance$(address, endpoint);
                        }  else if (storageData.selectedBlockchain === 'cosmos') {
                         
                             return this.cosmosService.getBalance$(address, 'https://a381ae3c.ngrok.io/cosmos/auth/accounts/');
                        }
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
            map((response) => {

                if (this.uiState.storageData.selectedBlockchain === 'binance')   {
                    return  pluckBalance(response, 'BNB');
                }  else {
                    return Number(response[0].free);
                }

            }),
            shareReplay(1)
        );

        // 2 minute
        const timer2m$ = timer(0, 120000);
        const transferFees$ = combineLatest([this.selectedNetwork$, timer2m$]).pipe(
            switchMap((x: [INetworkMenuItem, number]) => {
                const [networkMenuItem] = x;
                const endpoint = networkMenuItem.val;
                return this.http.get(`${endpoint}api/v1/fees`);
            }),
            shareReplay(1)
        );


        this.simpleFee$ = transferFees$.pipe(
            map((response: ITransferFees[]) => {
                const item = response.find((x) => x.multi_transfer_fee >= 0);
                return item.fixed_fee_params.fee / 100000000;
            }),
            shareReplay(1)
        );

        // TODO: think about using it
        this.simpleFee$.subscribe();

        this.baseCurrency$ = this.uiState$.pipe(
            filter((uiState) => uiState.storageData !== null),
            map((uiState) => {
                return uiState.storageData.baseFiatCurrency;
            }),
            startWith(CurrencySymbols.USD),
            shareReplay(1),
        );

        // Think about, maybe start with NaN
        this.bnb2fiatRate$ = combineLatest([timer2m$, this.baseCurrency$])
            .pipe(
                switchMap((x: any[]) => {
                    const [_, baseCurrency] = x;
                    if (this.uiState.storageData.selectedBlockchain === 'binance') {
                        return this.courses.getBinanceRate$(baseCurrency);
                    } else if (this.uiState.storageData.selectedBlockchain === 'cosmos') {
                        return this.courses.getCosmosRate$(baseCurrency);
                    }
                }),
                catchError((err) => {
                    console.log(err);
                    return of(NaN);
                }),
                map((rawRate: string) => {
                    return +rawRate;
                }),
                shareReplay(1),
            );

        this.bnbBalanceInFiat$ = combineLatest([this.bnbBalance$, this.bnb2fiatRate$]).pipe(
            map((arr: any[]) => {
                const [bnb, rate] = arr;
                const fiat = (bnb * rate);
                return +((Math.floor(fiat * 100) / 100).toFixed(2));
            }),
            shareReplay(1)
        );


        this.marketRates$ = timer(0, 24000).pipe(
            switchMap(() => {
                // debugger // TODO: Check how fast this things fires
                return this.http.get('https://dex.binance.org/api/v1/ticker/24hr');
            }),
            catchError(() => {
                return of(NaN);
            }),
            map((resp: IMarketRates[]) => resp),
            shareReplay(1)
        );

        this.history$ = combineLatest([this.currentAddress$, this.currentEndpoint$]).pipe(
            tap(() => {
                this.showHistoryLoadingIndicator$.next(true);
            }),
            switchMap((x) => {
                const [address, endpoint] = x;
                if (this.uiState.storageData.selectedBlockchain === 'binance') {
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
                }  else if (this.uiState.storageData.selectedBlockchain === 'cosmos') {
                    return concat(
                        cosmosService.getHistory$(address, endpoint).pipe(
                            tap(() => {
                                this.showHistoryLoadingIndicator$.next(false);
                            })
                        ),
                        timer(0, 10000).pipe(
                            switchMap(() => {
                                return cosmosService.getHistory$(address, endpoint);
                            })
                        )
                    );
                }

            }),
            shareReplay(1)
        );

        this.tokens$ = combineLatest([this.allBalances$, this.marketRates$, this.bnb2fiatRate$])
            .pipe(
                map((x: [IBalance[], IMarketRates[], number]) => {
                    const [balances, marketRates, bnb2usd] = x;
                    return balances
                        .map((token: IBalance) => {
                            const tokenSymbol = token.symbol;
                            const freeBalance = token.free;
                            const marketTicker = marketRates.find(o => o.baseAssetName === tokenSymbol);
                            const lastPrice = +(marketTicker && marketTicker.lastPrice) || 0;
                            return this.getTokenInfo(freeBalance, tokenSymbol, lastPrice, bnb2usd);
                        })
                        .filter((item: any) => {
                            return !!item;
                        })
                        .sort((a, b) => {
                            const usdDiff = b.balance2usd - a.balance2usd;
                            if (usdDiff !== 0) {
                                return usdDiff;
                            }

                            const cryptoDiff = Number(b.balance) - Number(a.balance);
                            return cryptoDiff !== 0
                                ? cryptoDiff
                                : a.symbol > b.symbol ? 1 : -1;
                        });
                }),
                shareReplay(1));
    }

    getTokenInfo(freeBalance: string, tokenSymbol: string, lastPrice: number, bnb2usd: number): ITokenInfo {

        const tokensDetails = tokenDetailsList.find(o => o.symbol === tokenSymbol);

        const tokenInfo: ITokenInfo = {
            symbol: tokenSymbol,
            // !tokensDetails -> 0
            balance2usd: (lastPrice * bnb2usd * Number(freeBalance)) || 0,
            balance: freeBalance,
            image: tokensDetails ? tokensDetails.image : '',
            name: tokensDetails ? tokensDetails.name : tokenSymbol,
            mappedName: tokensDetails ? tokensDetails.mappedAsset : tokenSymbol,
            rate2usd: Number(lastPrice) * bnb2usd,
            balance2usdStr: ''
        };

        return tokenInfo;
    }

    // createObservableSocket(url: string): Observable<any> {
    //     this.ws = new WebSocket(url);
    //
    //     return new Observable(
    //         observer => {
    //             this.ws.onmessage = (event) => observer.next(event.data);
    //             this.ws.onerror = (event) => observer.error(event);
    //             this.ws.onclose = () => observer.complete();
    //             return () => this.ws.close(1000, "The user disconnected");
    //         }
    //     );
    // }

    get uiState(): IUiState {
        return this.uiState$.getValue();
    }

    initState(data: IStorageData, password: string) {
        const selectedNetwork = data.selectedNetwork;
        const accountList = data.selectedBlockchain === 'binance'
            ? data.accounts
            : data.cosmosAccounts;

        const uiAccounts = storageAccounts2uiAccounts(accountList, selectedNetwork);
        const selectedAccount = uiAccounts.find((account: IUiAccount) => {
            return account.addressMainnet === data.selectedAddress || account.addressTestnet === data.selectedAddress;
        });

        const networkPrefix = data.selectedNetwork;
        const val = (networkPrefix === 'bnb' || networkPrefix === 'cosmos')
            ? NETWORK_ENDPOINT_MAPPING.MAINNET
            : NETWORK_ENDPOINT_MAPPING.TESTNET;

        const label = (networkPrefix === 'bnb' || networkPrefix === 'cosmos') ? 'mainnet' : 'testnet';
        const newSelectedNetwork: INetworkMenuItem = {
            networkPrefix,
            val,
            label
        };

        const uiState: IUiState = {
            accounts: uiAccounts,
            currentAccount: selectedAccount,
            storageData: data
        };

        this.uiState$.next(uiState);
        this.password = password;
        this.selectedNetwork$.next(newSelectedNetwork);
        this.selectedBlockchain$.next(data.selectedBlockchain);
    }

    resetState() {
        this.uiState$.next(emptyState);
        this.password = '';
    }

    selectBaseFiatCurrency(baseFiatCurrency: CurrencySymbols) {
        const newStorageState: IStorageData = {
            ...this.uiState.storageData,
            baseFiatCurrency
        };
        this.storageService.encryptAndSave(newStorageState, this.password);
        const newUiState: IUiState = {
            ...this.uiState,
            storageData: newStorageState
        };
        this.uiState$.next(newUiState);
    }

    renameAccount(accountIdx: number, newName: string): void {

        this.uiState.storageData.accounts[accountIdx].name = newName;
        const newStorageState: IStorageData = {
            ...this.uiState.storageData,
        };
        this.storageService.encryptAndSave(newStorageState, this.password);

        this.uiState.accounts[accountIdx].name = newName;
        const newUiState: IUiState = {
            ...this.uiState,
            storageData: newStorageState
        };
        this.uiState$.next(newUiState);
    }

    removeAccount(account: IUiAccount): void {

        if (this.uiState.accounts.length <= 0) {
            this.storageService.reset(); // Not sure that we need to reset in that case
            return; // But that return is definitely required
        }

        // Binance accounts
        const newAccounts = this.uiState.storageData.accounts
            .filter((accountToRemove) => accountToRemove.index !== account.index);

        // Cosmos accounts
        const newCosmosAccounts = this.uiState.storageData.cosmosAccounts
            .filter((accountToRemove) => accountToRemove.index !== account.index);

        const newAccountsUI = this.uiState.accounts
            .filter((accountToRemove) => accountToRemove.index !== account.index);


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
            cosmosAccounts: newCosmosAccounts,
            selectedAddress: this.uiState.storageData.accounts[accountToPick].addressMainnet,
            selectedNetwork: this.uiState.storageData.selectedNetwork,
            selectedNetworkEndpoint: this.uiState.storageData.selectedNetworkEndpoint,
            baseFiatCurrency: this.uiState.storageData.baseFiatCurrency,
            customNetworkEndpoints: this.uiState.storageData.customNetworkEndpoints,
            selectedBlockchain: this.uiState.storageData.selectedBlockchain
        };

        const newUiState: IUiState = {
            accounts: newAccountsUI,
            currentAccount: this.uiState.accounts[accountToPick],
            storageData: newStorageData
        };

        this.storageService.encryptAndSave(newStorageData, this.password);
        this.uiState$.next(newUiState);
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

        const address = this.uiState.storageData.selectedNetwork === 'bnb' ? addressMainnet : addressTestnet;

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

        const data = this.uiState.storageData;

        // const networkPrefix = network;
        const endpoint = network === 'bnb' || network === 'cosmos'
            ? NETWORK_ENDPOINT_MAPPING.MAINNET
            : NETWORK_ENDPOINT_MAPPING.TESTNET;

        const newStorageState: IStorageData = {
            ...data,
            selectedNetwork: network,
            selectedNetworkEndpoint: endpoint
        };

        this.storageService.encryptAndSave(newStorageState, this.password);

        const label = (network === 'bnb' || network === 'cosmos') ? 'mainnet' : 'testnet';
        const newSelectedNetwork: INetworkMenuItem = {
            networkPrefix: network,
            val: endpoint,
            label
        };

        this.selectedNetwork$.next(newSelectedNetwork);

        const accountList = network === 'cosmos'
            ? data.cosmosAccounts
            : data.accounts;

        const newUiAccounts = storageAccounts2uiAccounts(accountList, network);

        let selectedAccount = newUiAccounts.find((account) => {
            return account.addressMainnet === data.selectedAddress ||
                account.addressTestnet === data.selectedAddress;
        });

        if (!selectedAccount) {
            selectedAccount = newUiAccounts[0];
        }

        const newUiState: IUiState = {
            ...this.uiState,
            accounts: newUiAccounts,
            currentAccount: selectedAccount,
            storageData: newStorageState
        };

        this.uiState$.next(newUiState);
    }

    switchBlockchain() {
        const currentBlockchain = this.selectedBlockchain$.value;
        const newBlockchain = currentBlockchain === 'binance' ? 'cosmos' : 'binance';

        const selectedAddress = newBlockchain === 'binance'
            ? this.uiState.storageData.accounts[0].addressMainnet
            : this.uiState.storageData.cosmosAccounts[0].addressMainnet;

        const newStorageState: IStorageData = {
            ...this.uiState.storageData,
            selectedAddress,
            selectedBlockchain: newBlockchain
        };
        this.storageService.encryptAndSave(newStorageState, this.password);

        const newUiState: IUiState = {
            ...this.uiState,
            storageData: newStorageState
        };

        this.uiState$.next(newUiState);

        this.selectedBlockchain$.next(newBlockchain);

        // Switch to mainnet when switch blockchain
        // setTimeout()
        this.switchNetwork(newBlockchain === 'binance' ? 'bnb' : 'cosmos');
    }

    switchNetworkCustom(network: NetworkType, val: string): void {
        const newStorageState: IStorageData = {
            ...this.uiState.storageData,
            selectedNetwork: network,
            selectedNetworkEndpoint: val
        };
        this.storageService.encryptAndSave(newStorageState, this.password);

        const networkPrefix = network;
        let label;
        if (network === 'bnb' || network === 'cosmos') {
            label = 'mainnet';
        } else if (network === 'tbnb') {
            label = 'testnet';
        }

        const newSelectedNetwork: INetworkMenuItem = {
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
