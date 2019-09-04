import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {NETWORK_ENDPOINT_MAPPING} from "../../../../../services/network_endpoint_mapping";
import {IUiState, StateService} from "../../../../../services/state.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {NetworkType} from "../../../../../services/storage.service";

@Component({
    selector: 'app-custom-networks',
    templateUrl: './custom-networks.component.html',
    styleUrls: ['./custom-networks.component.css']
})
export class CustomNetworksComponent implements OnInit {

    formattedNetworksList = [
        {label: 'MAINNET', networkPrefix: 'bnb', val: NETWORK_ENDPOINT_MAPPING.MAINNET},
        {label: 'TESTNET', networkPrefix: 'tbnb', val: NETWORK_ENDPOINT_MAPPING.TESTNET},
        {label: 'CUSTOM', networkPrefix: 'custom', val: NETWORK_ENDPOINT_MAPPING.MAINNET_ASIA},
        {label: 'CUSTOM', networkPrefix: 'custom', val: NETWORK_ENDPOINT_MAPPING.MAINNET_ATLANTIC},
        {label: 'CUSTOM', networkPrefix: 'custom', val: NETWORK_ENDPOINT_MAPPING.MAINNET_EUROPE},
        {label: 'CUSTOM', networkPrefix: 'custom', val: NETWORK_ENDPOINT_MAPPING.TESTNET_ASIA},
        {label: 'CUSTOM', networkPrefix: 'custom', val: NETWORK_ENDPOINT_MAPPING.TESTNET_ATLANTIC}
    ];

    networksList = [
        {value: NETWORK_ENDPOINT_MAPPING.MAINNET_ASIA, label: 'Mainnet Asia', prefix: 'bnb'},
        {value: NETWORK_ENDPOINT_MAPPING.MAINNET_ATLANTIC, label: 'Mainnet Atlantic', prefix: 'bnb'},
        {value: NETWORK_ENDPOINT_MAPPING.MAINNET_EUROPE, label: 'Mainnet Europe', prefix: 'bnb'},
        {value: NETWORK_ENDPOINT_MAPPING.TESTNET_ASIA, label: 'Testnet Asia', prefix: 'tbnb'},
        {value: NETWORK_ENDPOINT_MAPPING.TESTNET_ATLANTIC, label: 'Testnet Atlantic', prefix: 'tbnb'},
        {value: NETWORK_ENDPOINT_MAPPING.TESTNET, label: 'Testnet Default', prefix: 'tbnb'},
        {value: NETWORK_ENDPOINT_MAPPING.MAINNET, label: 'Mainnet Default', prefix: 'bnb'},
    ];

    selectedNetworkLabel$: Observable<string>;
    selectedNetwork = null;

    constructor(private location: Location, private stateService: StateService) {

    }

    ngOnInit() {
        this.selectedNetworkLabel$ = this.stateService.uiState$.pipe(
            map((uiState: IUiState) => {
                const network = uiState.storageData.selectedNetworkEndpoint;
                switch (network) {
                    case NETWORK_ENDPOINT_MAPPING.MAINNET:
                        this.selectedNetwork = this.networksList[6];
                        return 'MAINNET';
                    case NETWORK_ENDPOINT_MAPPING.TESTNET:
                        this.selectedNetwork = this.networksList[5];
                        return 'TESTNET';
                    case NETWORK_ENDPOINT_MAPPING.TESTNET_ATLANTIC:
                        this.selectedNetwork = this.networksList[4];
                        return 'TESTNET';
                    case NETWORK_ENDPOINT_MAPPING.TESTNET_ASIA:
                        this.selectedNetwork = this.networksList[3];
                        return 'TESTNET';
                    case NETWORK_ENDPOINT_MAPPING.MAINNET_EUROPE:
                        this.selectedNetwork = this.networksList[2];
                        return 'MAINNET';
                    case NETWORK_ENDPOINT_MAPPING.MAINNET_ATLANTIC:
                        this.selectedNetwork = this.networksList[1];
                        return 'MAINNET';
                    case NETWORK_ENDPOINT_MAPPING.MAINNET_ASIA:
                        this.selectedNetwork = this.networksList[0];
                        return 'MAINNET';
                    default:
                        return 'MAINNET';
                }
            }),
        );
        this.selectedNetworkLabel$.subscribe();
    }

    goBack() {
        this.location.back();
    }

    selectNetwork() {
        this.stateService.switchNetworkCustom(this.selectedNetwork.prefix, this.selectedNetwork.value);
    }
    
}
