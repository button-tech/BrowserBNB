import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FirstPageComponent} from './components/first-page/first-page.component';
import {MainComponent} from './components/main/main.component';
import {UnlockComponent} from './components/unlock/unlock.component';
import {AuthGuardService as AuthGuard} from './services/auth-guard.service';
import {RegistrationComponent} from './components/registration/registration.component';
import {MnemonicComponent} from './components/registration/mnemonic/mnemonic.component';
import {ImportMnemonicComponent} from './components/registration/import-mnemonic/import-mnemonic.component';
import {PasswordComponent} from './components/registration/password/password.component';
import {RepeatPasswordComponent} from './components/registration/repeat-password/repeat-password.component';
import {SendComponent} from "./components/send/send.component";
import {AllBalancesComponent} from "./components/main/all-balances/all-balances.component";
import {SettingsComponent} from "./components/main/menu-top/settings/settings.component";
import {ReceiveComponent} from "./components/main/receive/receive.component";
import {HistoryDetailsComponent} from "./components/main/history-component/history-details/history-details.component";
import {GeneralComponent} from "./components/main/menu-top/settings/general/general.component";
import {AdvancedComponent} from "./components/main/menu-top/settings/advanced/advanced.component";
import {SecurityPrivacyComponent} from "./components/main/menu-top/settings/security-privacy/security-privacy.component";
import {CustomNetworksComponent} from "./components/main/menu-top/settings/custom-networks/custom-networks.component";
import {AboutComponent} from "./components/main/menu-top/settings/about/about.component";
import {WcSessionApproveComponent} from "./components/wc-session-approve/wc-session-approve.component";
import {ApproveComponent} from "./components/approve/approve.component";
import {SeedComponent} from "./components/main/menu-top/settings/security-privacy/seed/seed.component";
import {MoonPayComponent} from "./components/moon-pay/moon-pay.component";
import {StakingComponent} from "./components/main/staking/staking.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: '/main',
        pathMatch: 'full'
    },
    {
        path: 'main',
        component: MainComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'moonPay',
        component: MoonPayComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'wc-approve',
        component: WcSessionApproveComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'receive',
        component: ReceiveComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'details',
        component: HistoryDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'staking',
        component: StakingComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'send',
        component: SendComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'advanced',
        component: AdvancedComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'securitynprivacy',
        component: SecurityPrivacyComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'networks',
        component: CustomNetworksComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'about',
        component: AboutComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'approve/:operation',
        component: ApproveComponent
    },
    {
        path: 'general',
        component: GeneralComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'seed',
        component: SeedComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'greeter',
        component: FirstPageComponent,
    },
    {
        path: 'balances',
        component: AllBalancesComponent,
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'registration',
        component: RegistrationComponent,
        children: [
            {path: 'create', component: MnemonicComponent},
            {path: 'import', component: ImportMnemonicComponent},
            {path: 'password', component: PasswordComponent},
            {path: 'repeat', component: RepeatPasswordComponent},
        ]
    },
    {
        path: 'unlock',
        component: UnlockComponent,
    }, {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        onSameUrlNavigation: 'reload',
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
