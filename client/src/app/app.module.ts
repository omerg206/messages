import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessagesModule } from './messages-table/messages.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeModule } from './home/home.module';
import { AppRoutingModule } from './app-routing.routing';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';
@NgModule({
  declarations: [
    AppComponent,
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatTabsModule,
    QuicklinkModule,
  


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
