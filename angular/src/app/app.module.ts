import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GreeterComponent} from './first-page/greeter.component';
import {CreateComponent} from './register-mnemonic/create.component';
import {PasswordCreationComponent} from './register-password/password-creation.component';
import {MainComponent} from './main/main.component';

import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {MemoryService} from "./services/memory.service";

@NgModule({
    declarations: [
        AppComponent,
        GreeterComponent,
        CreateComponent,
        PasswordCreationComponent,
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
