import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GreeterComponent} from "./first-page/greeter.component";
import {RegisterMnemonicComponent} from "./register-mnemonic/register-mnemonic.component";
import {RegisterPasswordComponent} from "./register-password/register-password.component";
import {MainComponent} from "./main/main.component";
import {RegisterRepeatPasswordComponent} from "./register-repeat-password/register-repeat-password.component";
import {ImportMnemonicComponent} from "./import-mnemonic/import-mnemonic.component";
import {UnlockComponent} from "./unlock/unlock.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: '/greeter',
        pathMatch: 'full'
    },
    {
        path: 'greeter',
        component: GreeterComponent,
    },
    {
        path: 'create',
        component: RegisterMnemonicComponent,
    },
    {
        path: 'password',
        component: RegisterPasswordComponent,
    },
    {
        path: 'repeat',
        component: RegisterRepeatPasswordComponent,
    },
    {
        path: 'import',
        component: ImportMnemonicComponent,
    },
    {
        path: 'main',
        component: MainComponent,
    }, {
        path: 'unlock',
        component: UnlockComponent,
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
