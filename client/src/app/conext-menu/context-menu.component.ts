import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

export interface ContextMenuParams<T> {
  event: MouseEvent,
  item: T
}


@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnextMenuComponent<T> implements OnInit {
  contextMenuPosition = { x: '0px', y: '0px' };


  @Input() set triggerContextMenu(event: ContextMenuParams<T> | undefined) {
    if (event) {
      this.onContextMenu(event);
    }

  }


  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;

  constructor() { }

  ngOnInit(): void {
  }

  onContextMenu(params: ContextMenuParams<T>) {
    params.event.preventDefault();
    this.contextMenuPosition.x = params.event.clientX + 'px';
    this.contextMenuPosition.y = params.event.clientY + 'px';
    this.contextMenu.openMenu();
  }



}
