import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink';

const routes: Routes = [
  {
    path: '',
    redirectTo: './home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import(`./home/home.module`).then(
      module => module.HomeModule
    )
  },
  {
    path: 'messagesTable',
    loadChildren: () => import(`./messages-table/messages.module`).then(
      module => module.MessagesModule
    )
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: QuicklinkStrategy})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
