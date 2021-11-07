import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagesTableComponent } from './messages-table.component';

const routes: Routes = [
  {
    path: '',
    component: MessagesTableComponent
  }
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
