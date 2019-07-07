import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ToastrModule} from 'ng6-toastr-notifications';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GreeterComponent} from './greeter/greeter.component';
import {MainComponent} from './main/main.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SatPopoverModule} from '@ncstate/sat-popover';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HistoryComponentComponent} from './history-component/history-component.component';
import {StorageService} from './services/storage.service';
import {UnlockComponent} from './unlock/unlock.component';
import {EditFormComponent} from './edit-form/edit-form.component';
import {AuthService} from './services/auth.service';
import {RegistrationService} from './services/registration.service';
import {AuthGuardService} from './services/auth-guard.service';
import {RegistrationComponent} from './registration/registration.component';
import {ClipboardService} from './services/clipboard.service';
import {RegisterMnemonicComponent} from './registration/register-mnemonic/register-mnemonic.component';
import {RegisterPasswordComponent} from './registration/register-password/register-password.component';
import {RegisterRepeatPasswordComponent} from './registration/register-repeat-password/register-repeat-password.component';
import {ImportMnemonicComponent} from './registration/import-mnemonic/import-mnemonic.component';


@NgModule({
    declarations: [
        AppComponent,
        GreeterComponent,
        RegisterMnemonicComponent,
        RegisterPasswordComponent,
        MainComponent,
        RegisterRepeatPasswordComponent,
        ImportMnemonicComponent,
        HistoryComponentComponent,
        UnlockComponent,
        EditFormComponent,
        RegistrationComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFontAwesomeModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        HttpClientModule,
        FormsModule,
        SatPopoverModule
    ],
    providers: [
        RegistrationService,
        AuthService,
        AuthGuardService,
        StorageService,
        ClipboardService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
