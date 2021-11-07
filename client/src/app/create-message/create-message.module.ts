import { MatInputModule } from '@angular/material/input';
import {  ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CreateMessageComponent } from './create-message.component';
import {MatCardModule} from '@angular/material/card';
import { CreateMessageRouterModule } from './create-messages.routing';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  imports: [
    MatCardModule,
    CreateMessageRouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  declarations: [CreateMessageComponent]
})
export class CreateMessageModule { }
