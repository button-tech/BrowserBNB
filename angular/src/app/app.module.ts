import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GreeterComponent} from './first-page/greeter.component';
import {RegisterMnemonicComponent} from './register-mnemonic/register-mnemonic.component';
import {RegisterPasswordComponent} from './register-password/register-password.component';
import {MainComponent} from './main/main.component';

import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {MemoryService} from "./services/memory.service";

@NgModule({
    declarations: [
        AppComponent,
        GreeterComponent,
        RegisterMnemonicComponent,
        RegisterPasswordComponent,
        MainComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFontAwesomeModule
    ],
    providers: [MemoryService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
