import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ToastrModule} from 'ng6-toastr-notifications';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FirstPageComponent} from './components/first-page/first-page.component';
import {MainComponent} from './components/main/main.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SatPopoverModule} from '@ncstate/sat-popover';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HistoryComponentComponent} from './components/main/history-component/history-component.component';
import {StorageService} from './services/storage.service';
import {UnlockComponent} from './components/unlock/unlock.component';
import {EditFormComponent} from './components/main/edit-form/edit-form.component';
import {AuthService} from './services/auth.service';
import {RegistrationService} from './services/registration.service';
import {AuthGuardService} from './services/auth-guard.service';
import {RegistrationComponent} from './components/registration/registration.component';
import {ClipboardService} from './services/clipboard.service';
import {RegisterMnemonicComponent} from './components/registration/register-mnemonic/register-mnemonic.component';
import {RegisterPasswordComponent} from './components/registration/register-password/register-password.component';
import {RegisterRepeatPasswordComponent} from './components/registration/register-repeat-password/register-repeat-password.component';
import {ImportMnemonicComponent} from './components/registration/import-mnemonic/import-mnemonic.component';
import {CurrentAccountService} from './services/current-account.service';
import {BinanceService} from './services/binance.service';
import {SendComponent} from './components/transfer/send/send.component';
import {MenuTopComponent} from './components/main/menu-top/menu-top.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {CoinsSelectComponent} from './components/transfer/send/forms/coins-select/coins-select.component';
import {AmountInputComponent} from './components/transfer/send/forms/amount-input/amount-input.component';
import {
    MatFormFieldModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule,
} from "@angular/material";
import {AddressInputComponent} from './components/transfer/send/forms/address-input/address-input.component';
import {MemoInputComponent} from './components/transfer/send/forms/memo-input/memo-input.component';
import {VerifySendComponent} from './components/transfer/verify-send/verify-send.component';
import {AllBalancesComponent} from './components/main/all-balances/all-balances.component';
import {SettingsComponent} from './components/main/settings/settings.component';
import {StateService} from './services/state.service';


@NgModule({
    declarations: [
        AppComponent,
        FirstPageComponent,
        RegisterMnemonicComponent,
        RegisterPasswordComponent,
        MainComponent,
        RegisterRepeatPasswordComponent,
        ImportMnemonicComponent,
        HistoryComponentComponent,
        UnlockComponent,
        EditFormComponent,
        RegistrationComponent,
        SendComponent,
        MenuTopComponent,
        CoinsSelectComponent,
        AmountInputComponent,
        AddressInputComponent,
        MemoInputComponent,
        VerifySendComponent,
        AllBalancesComponent,
        SettingsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFontAwesomeModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        HttpClientModule,
        FormsModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        SatPopoverModule, NgSelectModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule,
    ],
    providers: [
        RegistrationService,
        AuthService,
        AuthGuardService,
        StorageService,
        StateService,
        ClipboardService,
        CurrentAccountService,
        BinanceService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
