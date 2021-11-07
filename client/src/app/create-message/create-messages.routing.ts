import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMessageComponent } from './create-message.component';

const routes: Routes = [
  {
    path: '',
    component: CreateMessageComponent
  }
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateMessageRouterModule { }
