import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MessagesTableComponent } from './messages-table.component';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: MessagesTableComponent
  }
 ];



@NgModule({
  declarations: [
    MessagesTableComponent,
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [TitleCasePipe],
  exports: [ RouterModule]
})
export class MessagesModule { }
