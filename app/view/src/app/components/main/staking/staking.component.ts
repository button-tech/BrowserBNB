import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {map, switchMap, tap} from "rxjs/operators";
import {combineLatest, Observable, Subscription} from "rxjs";
import {StateService} from "../../../services/state.service";
import BigNumber from 'bignumber.js';
import {HttpClient} from "@angular/common/http";
import {CosmosDelegation} from '@trustwallet/rpc/src/cosmos/models/CosmosDelegation';
import {CosmosService} from "../../../services/cosmos.service";

@Component({
    selector: 'app-staking',
    templateUrl: './staking.component.html',
    styleUrls: ['./staking.component.css']
})
export class StakingComponent implements OnInit {
    subscriptions: Subscription;
    rate2usd: any;
    fiatStaked: Observable<string>;
    staked: Observable<string>;
    abc = 0;

    constructor(private location: Location, public stateService: StateService, private http: HttpClient, private cosmos: CosmosService) {
        this.staked = this.calculateStakedAmount(this.stateService.uiState.currentAccount.address).pipe(
            map((resp) => {
                return resp.toString();
            })
        );


        this.fiatStaked = combineLatest([this.stateService.bnb2fiatRate$, this.staked]).pipe(
            map((x: any[]) => {
                const [rate, amount] = x;
                return Number(rate) * Number(amount);
            }),
            map((finalB) => {
                return finalB.toFixed(2);
            })
        );

    }

    calculateStakedAmount(address): Observable<number> {
        const sub = this.http.get(`https://lcd-do-not-abuse.cosmostation.io/staking/delegators/${address}/delegations`).pipe(
            map((delegations: CosmosDelegation[]) => {
                const shares = delegations && delegations.map((d: CosmosDelegation) => d.shares) || [];
                console.log(address);
                console.log(Number(BigNumber.sum(...shares)) / 1000000);
                return Number(BigNumber.sum(...shares)) / 1000000;
            })
        );
        return sub;
    }


    ngOnInit() {
    }

    goBack() {
        this.location.back();
    }

}
