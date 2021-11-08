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
import { CellDisplayComponent } from './cell-display/cell-display.component';
import { FocusableDirective } from './cell-display/directives/focusable.directive';


const routes: Routes = [
  {
    path: '',
    component: MessagesTableComponent
  }
 ];



@NgModule({
  declarations: [
    MessagesTableComponent,
    CellDisplayComponent,
    FocusableDirective
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTableModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [TitleCasePipe],
  exports: [ RouterModule]
})
export class MessagesTableModule { }
