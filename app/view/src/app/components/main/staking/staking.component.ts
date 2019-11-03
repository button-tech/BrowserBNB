import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {map, switchMap, tap} from "rxjs/operators";
import {combineLatest, interval, Observable, Subscription, timer} from "rxjs";
import {StateService} from "../../../services/state.service";
import BigNumber from 'bignumber.js';
import {HttpClient} from "@angular/common/http";
import {CosmosDelegation} from '@trustwallet/rpc/src/cosmos/models/CosmosDelegation';
import {CosmosService} from "../../../services/cosmos.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-staking',
    templateUrl: './staking.component.html',
    styleUrls: ['./staking.component.css']
})
export class StakingComponent implements OnInit {
    subscriptions: Subscription;
    fiatStaked: Observable<string>;
    staked: Observable<string>;

    amount = 0;

    constructor(private location: Location,
                private router: Router,
                public stateService: StateService,
                private http: HttpClient,
                private cosmos: CosmosService) {


        this.staked = timer(0, 2000).pipe(
            switchMap(() => {
                return this.calculateStakedAmount(this.stateService.uiState.currentAccount.address).pipe(
                    map((resp) => {
                        return resp.toString();
                    })
                );
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

    calculateStakedAmount(address: string): Observable<number> {
        return this.http.get(`https://lcd-do-not-abuse.cosmostation.io/staking/delegators/${address}/delegations`).pipe(
            map((delegations: CosmosDelegation[]) => {
                const shares = delegations && delegations.map((d: CosmosDelegation) => d.shares) || [];
                console.log(address);
                console.log(Number(BigNumber.sum(...shares)) / 1000000);
                return Number(BigNumber.sum(...shares)) / 1000000;
            })
        );
    }


    ngOnInit() {
    }

    goBack() {
        this.location.back();
    }

    get rawAmount(): number {
        return +this.amount * 1000000;
    }

    doStake() {
        const {address, privateKey} = this.stateService.uiState.currentAccount;
        this.cosmos.stakeFast(this.rawAmount, address, privateKey);
        // this.router.navigate(['/main']);
    }

    doUnStake() {
        const {address, privateKey} = this.stateService.uiState.currentAccount;
        this.cosmos.unStakeFast(this.rawAmount, address, privateKey);
        // this.router.navigate(['/main']);
    }
}
