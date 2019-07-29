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
}

export interface IUiState {
    accounts: IUiAccount[],
    activeAccount: IUiAccount,
    network: NetworkType
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
        network: null
    });

    selectedNetwork$: BehaviorSubject<IMenuItem>;
    uiState$: BehaviorSubject<IUiState> = new BehaviorSubject(this.emptyState);
    password$: BehaviorSubject<string> = new BehaviorSubject('');

    public get uiState(): IUiState {
        return this.uiState$.getValue();
    }

    networkMenu: IMenuItem[];

    public get selectedNetwork(): IMenuItem {
        return this.selectedNetwork$.getValue();
    }

    private password: string = '';

    initState(data: IStorageData, password: string) {

        const accounts = data.accounts.map((account) => {
            const name = data.address2name[account.addressMainnet];
            return {
                ...account,
                name
            };
        });

        const activeAccount = accounts.find((account) => {
            return account.addressMainnet === data.selectedAddress || account.addressTestnet === data.selectedAddress;
        });

        const uiState: IUiState = {
            accounts,
            activeAccount: activeAccount,
            network: data.selectedNetwork
        };

        this.uiState$.next(uiState);
        this.password = password;
    }

    resetState() {
        this.uiState$.next(this.emptyState);
        this.password = '';
    }


    private subscription: Subscription;

    constructor(private storageService: StorageService, private bncService: BinanceService) {

        // const storageData$ = this.storageService.storageData$;
        //
        // type CombinedData = [IStorageData, string];
        // const source = [storageData$, this.password$];

        // const seedPhrase$: Observable<string> = combineLatest(source).pipe(
        //     filter((x: CombinedData) => {
        //         const [data, password] = x; // Допустим тут менять только если поменялся пароль и storage ??
        //         return !!(data.EncryptedSeedPhrase && password);
        //     }),
        //     switchMap((x: CombinedData) => {
        //         const [data, password] = x;
        //         return from(passworder.decrypt(password, data.EncryptedSeedPhrase));
        //     }),
        //     map((decrypted: any) => {
        //         return decrypted.seedPhrase as string;
        //     })
        // );

        // const uiState$ = combineLatest([seedPhrase$, storageData$]).pipe(
        //     map((x) => {
        //         const [seedPhrase, storageData] = x;
        //         const {MaxAccount, CurrentAccountIdx, NetworkPrefix, NamesMapping} = storageData;
        //
        //         const accounts = [];
        //         for (let i = 0; i <= MaxAccount; i++) {
        //             const privateKey = getPrivateKeyFromMnemonic(seedPhrase, i);
        //             const address = getAddressFromPrivateKey(privateKey, NetworkPrefix);
        //             const accountName = NamesMapping[address] || `Account ${i + 1}`;
        //             accounts.push({
        //                 idx: i,
        //                 accountName,
        //                 address,
        //                 privateKey
        //             });
        //         }
        //
        //         const activeAccount = accounts[CurrentAccountIdx] || accounts[0];
        //
        //         return {
        //             accounts: accounts,
        //             activeAccount,
        //             networkPrefix: NetworkPrefix
        //         };
        //     })
        // );
        // this.subscription = uiState$.subscribe((uiState: IUiState) => {
        //     this.uiState$.next(uiState);
        // });
        //seedPhrase$.subscribe();

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

        this.selectedNetwork$ = new BehaviorSubject(this.networkMenu[0]);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
