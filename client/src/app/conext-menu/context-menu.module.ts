import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnextMenuComponent } from 'src/app/conext-menu/context-menu.component';
import {MatMenuModule} from '@angular/material/menu';


@NgModule({
  declarations: [ConnextMenuComponent],
  exports: [ConnextMenuComponent],
  imports: [
    MatMenuModule
  ]
})
export class ContextMenuModule { }
