import {QRCodeModule} from 'angularx-qrcode';
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
import {MnemonicComponent} from './components/registration/mnemonic/mnemonic.component';
import {PasswordComponent} from './components/registration/password/password.component';
import {RepeatPasswordComponent} from './components/registration/repeat-password/repeat-password.component';
import {ImportMnemonicComponent} from './components/registration/import-mnemonic/import-mnemonic.component';
import {BinanceService} from './services/binance.service';
import {SendComponent} from './components/transfer/send/send.component';
import {MenuTopComponent} from './components/main/menu-top/menu-top.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {CoinsSelectComponent} from './components/transfer/send/forms/coins-select/coins-select.component';
import {AmountInputComponent} from './components/transfer/send/forms/amount-input/amount-input.component';
import {MatFormFieldModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule,} from '@angular/material';
import {AddressInputComponent} from './components/transfer/send/forms/address-input/address-input.component';
import {MemoInputComponent} from './components/transfer/send/forms/memo-input/memo-input.component';
import {VerifySendComponent} from './components/transfer/verify-send/verify-send.component';
import {AllBalancesComponent} from './components/main/all-balances/all-balances.component';
import {SettingsComponent} from './components/main/menu-top/settings/settings.component';
import {NetworksComponent} from './components/main/menu-top/networks/networks.component';
import {AccountsComponent} from './components/main/menu-top/accounts/accounts.component';
import {RecieveComponent} from './components/main/recieve/recieve.component';
import {HistoryDetailsComponent} from './components/main/history-component/history-details/history-details.component';
import {StateService} from './services/state.service';
import {FmtPipe} from './fmt.pipe';
import {NgxLoadersCssModule} from 'ngx-loaders-css';
import {GeneralComponent} from './components/main/menu-top/settings/general/general.component';
import {AdvancedComponent} from './components/main/menu-top/settings/advanced/advanced.component';
import {SecurityPrivacyComponent} from './components/main/menu-top/settings/security-privacy/security-privacy.component';
import {ChromeApiMockService, ChromeApiRealService, ChromeApiService} from "./services/chrome-api.service";
import {CustomNetworksComponent} from './components/main/menu-top/settings/custom-networks/custom-networks.component';
import { AboutComponent } from './components/main/menu-top/settings/about/about.component';


@NgModule({
    declarations: [
        AppComponent,
        FirstPageComponent,
        MnemonicComponent,
        PasswordComponent,
        MainComponent,
        RepeatPasswordComponent,
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
        SettingsComponent,
        NetworksComponent,
        AccountsComponent,
        RecieveComponent,
        HistoryDetailsComponent,
        FmtPipe,
        GeneralComponent,
        AdvancedComponent,
        SecurityPrivacyComponent,
        CustomNetworksComponent,
        AboutComponent
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
        SatPopoverModule,
        NgSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        QRCodeModule,
        NgxLoadersCssModule
    ],
    providers: [
        RegistrationService,
        AuthService,
        AuthGuardService,
        StateService,
        StorageService,
        ClipboardService,
        BinanceService,
        ChromeApiMockService,
        ChromeApiRealService,
        ChromeApiService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
