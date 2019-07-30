import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NetworkType} from '../../../../services/storage.service';
import {NETWORK_ENDPOINT_MAPPING} from '../../../../services/network_endpoint_mapping';
import {StateService} from '../../../../services/state.service';
import {pluck, map} from 'rxjs/operators';
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
            pluck('network'),
            map((network: NetworkType) => {
                return network === 'bnb' ? 'MAINNET' : 'TESTNET';
            })
        );
    }

    selectNetwork(value: NetworkType) {
        this.stateService.switchNetwork(value);
    }

}
