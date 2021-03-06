import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CreateMessageComponent } from './create-message.component';
import { MatCardModule } from '@angular/material/card';
import { CreateMessageRouterModule } from './create-messages.routing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    MatCardModule,
    CreateMessageRouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    HttpClientModule
  ],
  declarations: [CreateMessageComponent]
})
export class CreateMessageModule { }
