import {Component, ElementRef, ViewChild} from '@angular/core';
import {BlockchainType, NetworkType} from '../../../../services/storage.service';
import {NETWORK_ENDPOINT_MAPPING} from '../../../../services/network_endpoint_mapping';
import {INetworkMenuItem, IUiState, StateService} from '../../../../services/state.service';
import {map, startWith} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
    selector: 'app-networks',
    templateUrl: './networks.component.html',
    styleUrls: ['./networks.component.css']
})
export class NetworksComponent {

    // @ts-ignore
    @ViewChild('menuNetwork')
    menuNetwork: ElementRef;
    networkMenu$: Observable<any[]>;
    selectedNetworkLabel$: Observable<string>;

    constructor(private stateService: StateService) {
        this.networkMenu$ = this.stateService.selectedBlockchain$.pipe(
            map((blockchain: BlockchainType) => {
                if (blockchain === 'cosmos') {
                    return [
                        {
                            label: 'MAINNET',
                            networkPrefix: 'bnb',
                            val: ''
                        }
                    ];
                }

                if (blockchain === 'binance') {
                    return [
                        {
                            label: 'MAINNET',
                            networkPrefix: 'bnb',
                            val: ''
                        },
                        {
                            label: 'TESTNET',
                            networkPrefix: 'tbnb',
                            val: ''
                        },
                    ];
                }

                return [];
            }),
            startWith([])
        );
    }

    selectNetwork(value: NetworkType) {
        this.stateService.switchNetwork(value);
    }

}
