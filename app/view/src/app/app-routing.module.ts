import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FirstPageComponent} from './components/first-page/first-page.component';
import {MainComponent} from './components/main/main.component';
import {UnlockComponent} from './components/unlock/unlock.component';
import {
    AuthGuardService as AuthGuard
} from './services/auth-guard.service';
import {RegistrationComponent} from './components/registration/registration.component';
import {MnemonicComponent} from './components/registration/mnemonic/mnemonic.component';
import {ImportMnemonicComponent} from './components/registration/import-mnemonic/import-mnemonic.component';
import {PasswordComponent} from './components/registration/password/password.component';
import {RepeatPasswordComponent} from './components/registration/repeat-password/repeat-password.component';
import {SendComponent} from "./components/transfer/send/send.component";
import {VerifySendComponent} from "./components/transfer/verify-send/verify-send.component";
import {AllBalancesComponent} from "./components/main/all-balances/all-balances.component";
import {SettingsComponent} from "./components/main/settings/settings.component";
import {RecieveComponent} from "./components/main/recieve/recieve.component";

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
        path: 'receive',
        component: RecieveComponent,
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
        onSameUrlNavigation: 'reload'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
