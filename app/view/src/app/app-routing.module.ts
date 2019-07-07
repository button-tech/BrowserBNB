import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GreeterComponent} from './greeter/greeter.component';
import {RegisterMnemonicComponent} from './register-mnemonic/register-mnemonic.component';
import {RegisterPasswordComponent} from './register-password/register-password.component';
import {MainComponent} from './main/main.component';
import {RegisterRepeatPasswordComponent} from './register-repeat-password/register-repeat-password.component';
import {ImportMnemonicComponent} from './import-mnemonic/import-mnemonic.component';
import {UnlockComponent} from './unlock/unlock.component';
import {
    AuthGuardService as AuthGuard
} from './services/auth-guard.service';
import {RegistrationComponent} from './registration/registration.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/main',
        pathMatch: 'full'
    }, {
        path: 'main',
        component: MainComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'greeter',
        component: GreeterComponent,
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
