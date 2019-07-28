import {Injectable, OnDestroy} from '@angular/core';
import {IStorageData, StorageService} from './storage.service';
import * as passworder from 'browser-passworder';
import {BehaviorSubject, combineLatest, from, Observable, of, Subscription} from 'rxjs';
import {filter, map, startWith, switchMap, tap} from 'rxjs/operators';
import {BinanceService} from './binance.service';
import {getPrivateKeyFromMnemonic, getAddressFromPrivateKey} from './binance-crypto';

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
    idx: string; // index in hd wallet
    accountName: string;
    address: string;
    privateKey: string;
}

export interface IUiState {
    accounts: IAccount[],
    activeAccount: IAccount,
    networkPrefix: string
}

@Injectable()
export class StateService implements OnDestroy {

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
        networkPrefix: null
    });

    selectedNetwork$: BehaviorSubject<IMenuItem>;
    accounts$: BehaviorSubject<IAccount[]> = new BehaviorSubject([]);
    currentAccount$: BehaviorSubject<IAccount> = new BehaviorSubject(null);
    uiState$: BehaviorSubject<IUiState> = new BehaviorSubject(this.emptyState);
    password$: BehaviorSubject<string> = new BehaviorSubject('');

    public get uiState(): IUiState {
        return this.uiState$.getValue();
    }

    networkMenu: IMenuItem[];

    public get accounts(): IAccount[] {
        return this.accounts$.getValue();
    }

    public get currentAccount(): IAccount | null {
        return this.currentAccount$.getValue();
    }


    public get selectedNetwork(): IMenuItem {
        return this.selectedNetwork$.getValue();
    }

    // Store that in memory
    private password: string;

    setPassword(repeatedPassword: string) {
        this.password = repeatedPassword;
        this.password$.next(this.password);
    }

    private subscription: Subscription;

    constructor(private storageService: StorageService, private bncService: BinanceService) {

        // this.subscription = this.storageService.storageData$.pipe(
        //     map((data: IStorageData) => {
        //         passworder.decrypt(this.password, data.EncryptedSeedPhrase).then((seed) => {
        //             debugger;
        //         });
        //         // data.EncryptedSeedPhrase
        //         // const
        //         // return [];
        //     }),
        //     tap(() => {
        //         // Modify accounts
        //         this.accounts$.next([]);
        //         // Modify selected
        //     })
        // ).subscribe();
        // const password$ = of('123');

        const storageData$ = this.storageService.storageData$;
        type CombinedData = [IStorageData, string];
        const source = [storageData$, this.password$];
        const seedPhrase$: Observable<string> = combineLatest(source).pipe(
            filter((x: CombinedData) => {
                const [data, password] = x; // Допустим тут менять только если поменялся пароль и storage ??
                return !!(data.EncryptedSeedPhrase && password);
            }),
            switchMap((x: CombinedData) => {
                const [data, password] = x;
                return from(passworder.decrypt(password, data.EncryptedSeedPhrase));
            }),
            map((decrypted: any) => {
                return decrypted.seedPhrase as string;
            })
        );
        // map((x) => {
        //     const [seedPhrase, current]
        //     // Распаковать аккаунты
        //     return '';
        // })

        const uiState$ = combineLatest([seedPhrase$, storageData$]).pipe(
            map((x) => {
                const [seedPhrase, storageData] = x;
                const {MaxAccount, CurrentAccountIdx, NetworkPrefix, NamesMapping} = storageData;

                const accounts = [];
                for (let i = 0; i <= MaxAccount; i++) {
                    const privateKey = getPrivateKeyFromMnemonic(seedPhrase, i);
                    const address = getAddressFromPrivateKey(privateKey, NetworkPrefix);
                    const accountName = NamesMapping[address] || `Account ${i + 1}`;
                    accounts.push({
                        idx: i,
                        accountName,
                        address,
                        privateKey
                    });
                }

                const activeAccount = accounts[CurrentAccountIdx] || accounts[0];

                return {
                    accounts: accounts,
                    activeAccount,
                    networkPrefix: NetworkPrefix
                };
            })
        );

        this.subscription = uiState$.subscribe((uiState: IUiState) => {
            this.uiState$.next(uiState);
        });

        //seedPhrase$.subscribe();

        this.networkMenu = [
            {
                label: 'MAINNET',
                networkPrefix: 'bnb',
                val: this.bncService.endpointList.MAINNET
            },
            {
                label: 'TESTNET',
                networkPrefix: 'tbnb',
                val: this.bncService.endpointList.TESTNET
            },
        ];

        this.selectedNetwork$ = new BehaviorSubject(this.networkMenu[0]);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
