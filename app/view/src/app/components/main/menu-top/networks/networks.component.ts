import {Component, ElementRef, ViewChild} from '@angular/core';
import {NetworkType} from '../../../../services/storage.service';
import {NETWORK_ENDPOINT_MAPPING} from '../../../../services/network_endpoint_mapping';
import {IUiState, StateService} from '../../../../services/state.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-networks',
    templateUrl: './networks.component.html',
    styleUrls: ['./networks.component.css']
})
export class NetworksComponent {

    // @ts-ignore
    @ViewChild('menuNetwork')
    menuNetwork: ElementRef;

    networkMenu = [
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

    selectedNetworkLabel$: Observable<string>;

    constructor(private stateService: StateService) {

        this.selectedNetworkLabel$ = stateService.uiState$.pipe(
            map((uiState: IUiState) => {
                const network = uiState.storageData.selectedNetwork;
                switch (network) {
                    case 'bnb':
                        return 'MAINNET';
                    case 'tbnb':
                        return 'TESTNET';
                    default:
                        return 'MAINNET';
                }
            })
        );
    }

    selectNetwork(value: NetworkType) {
        this.stateService.switchNetwork(value);
    }

}
