import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { ToastrModule } from 'ng6-toastr-notifications';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GreeterComponent} from './first-page/greeter.component';
import {RegisterMnemonicComponent} from './register-mnemonic/register-mnemonic.component';
import {RegisterPasswordComponent} from './register-password/register-password.component';
import {MainComponent} from './main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SatPopoverModule} from '@ncstate/sat-popover';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {MemoryService} from "./services/memory.service";
import { RegisterRepeatPasswordComponent } from './register-repeat-password/register-repeat-password.component';
import { FormsModule } from '@angular/forms';
import { ImportMnemonicComponent } from './import-mnemonic/import-mnemonic.component';
import {HttpClientModule} from '@angular/common/http';
import { HistoryComponentComponent } from './history-component/history-component.component';
import {StorageService} from "./services/storage.service";
import { UnlockComponent } from './unlock/unlock.component';
import { EditFormComponent } from './edit-form/edit-form.component';

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
        EditFormComponent
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
    providers: [MemoryService, StorageService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
