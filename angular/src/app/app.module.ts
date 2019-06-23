import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GreeterComponent} from './greeter/greeter.component';
import {CreateComponent} from './create/create.component';
import {PasswordCreationComponent} from './password-creation/password-creation.component';
import {MainComponent} from './main/main.component';

import {AngularFontAwesomeModule} from 'angular-font-awesome';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
