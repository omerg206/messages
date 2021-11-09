import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink';




const routes: Routes = [

  {
    path: 'home',
    loadChildren: () => import(`./home/home.module`).then(
      module => module.HomeModule
    )
  },
  {
    path: 'messagesTable',
    loadChildren: () => import(`./messages-table/messages-table.module`).then(
      module => module.MessagesTableModule
    )
  },
  {
    path: 'createMessage',
    loadChildren: () => import(`./create-message/create-message.module`).then(
      module => module.CreateMessageModule
    )
  },
  {
    path: '**',
    loadChildren: () => import(`./home/home.module`).then(
      module => module.HomeModule
    )
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: QuicklinkStrategy })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
