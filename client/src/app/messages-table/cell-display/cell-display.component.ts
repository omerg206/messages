import { Component, OnInit, ChangeDetectionStrategy, Input, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Message } from '../../../../../shared/messages.model';

const EditableMessageKeys: Array<keyof Message> = ["sender", "body"]

@Component({
  selector: 'app-cell-display',
  templateUrl: './cell-display.component.html',
  styleUrls: ['./cell-display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellDisplayComponent implements OnInit {
  @Input() set displayKey(key: keyof Message) {
    this.isKeyEditable = EditableMessageKeys.includes(key)
  }

  @Input() displayValue: string | number | Date | null | undefined;

  isEditMode: boolean = false;
  isKeyEditable: boolean = false;


  @HostListener('dblclick', ['$event'])
  onDbClick($event: Event) {
    if (this.isKeyEditable) {
      this.isEditMode = true;
    }

  }

  @HostListener('focusout', ['$event'])
  onFocusOut($event: Event) {
    this.isEditMode = false;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
