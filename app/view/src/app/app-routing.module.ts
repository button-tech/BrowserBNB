import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FirstPageComponent} from './components/first-page/first-page.component';
import {MainComponent} from './components/main/main.component';
import {UnlockComponent} from './components/unlock/unlock.component';
import {
    AuthGuardService as AuthGuard
} from './services/auth-guard.service';
import {RegistrationComponent} from './components/registration/registration.component';
import {RegisterMnemonicComponent} from './components/registration/register-mnemonic/register-mnemonic.component';
import {ImportMnemonicComponent} from './components/registration/import-mnemonic/import-mnemonic.component';
import {RegisterPasswordComponent} from './components/registration/register-password/register-password.component';
import {RegisterRepeatPasswordComponent} from './components/registration/register-repeat-password/register-repeat-password.component';
import {SendComponent} from "./components/transfer/send/send.component";
import {VerifySendComponent} from "./components/transfer/verify-send/verify-send.component";
import {AllBalancesComponent} from "./components/main/all-balances/all-balances.component";
import {SettingsComponent} from "./components/main/settings/settings.component";

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
        path: 'send',
        component: SendComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'verify_send',
        component: VerifySendComponent,
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
    },
    {
        path: 'registration',
        component: RegistrationComponent,
        children: [
            {path: 'create', component: RegisterMnemonicComponent},
            {path: 'import', component: ImportMnemonicComponent},
            {path: 'password', component: RegisterPasswordComponent},
            {path: 'repeat', component: RegisterRepeatPasswordComponent},
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
        onSameUrlNavigation: 'reload'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
