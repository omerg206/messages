import { Component } from '@angular/core';
export interface TabItem {
  label: string;
  route: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  tabs: TabItem[] = [{
    label: 'HOME',
    route: './home'
  },
  {
    label: 'Messages Table',
    route: './messagesTable'
  }]

}
