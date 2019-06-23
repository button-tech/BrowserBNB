import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GreeterComponent} from "./greeter/greeter.component";
import {CreateComponent} from "./create/create.component";
import {PasswordCreationComponent} from "./password-creation/password-creation.component";
import {MainComponent} from "./main/main.component";

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
    component: CreateComponent,
  },
  {
    path: 'password',
    component: PasswordCreationComponent,
  },
  {
    path: 'main',
    component: MainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
