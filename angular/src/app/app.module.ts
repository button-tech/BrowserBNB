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

import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {MemoryService} from "./services/memory.service";
import { RegisterRepeatPasswordComponent } from './register-repeat-password/register-repeat-password.component';
import { FormsModule } from '@angular/forms';
import { ImportMnemonicComponent } from './import-mnemonic/import-mnemonic.component';

@NgModule({
    declarations: [
        AppComponent,
        GreeterComponent,
        RegisterMnemonicComponent,
        RegisterPasswordComponent,
        MainComponent,
        RegisterRepeatPasswordComponent,
        ImportMnemonicComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFontAwesomeModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot() ,
        FormsModule
    ],
    providers: [MemoryService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
