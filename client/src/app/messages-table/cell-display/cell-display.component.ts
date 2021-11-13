import { Component, OnInit, ChangeDetectionStrategy, Input, HostListener, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
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
    this._displayKey = key;
    this.isKeyEditable = EditableMessageKeys.includes(key)
  }

  @Input() messageId!: string;
  @Input() displayValue: string | number | Date | null | undefined;
  @Output() editEnd: EventEmitter<Partial<Message> & Pick<Message, '_id'>> = new EventEmitter<Partial<Message> & Pick<Message, '_id'>>();

  @ViewChild('editableInput') editableInput!: ElementRef;

  isEditMode: boolean = false;
  isKeyEditable: boolean = false;
  _displayKey!: keyof Message;


  @HostListener('dblclick', ['$event'])
  onDbClick($event: Event) {
    if (this.isKeyEditable) {
      this.isEditMode = true;
    }

  }

  @HostListener('focusout', ['$event'])
  onFocusOut($event: Event) {
    this.isEditMode = false;
    const currentInputValue = this.editableInput.nativeElement.value;
    if (this.displayValue != currentInputValue) {
      this.editEnd.emit(
        {
          _id: this.messageId,
          [this._displayKey]: this.convertEditInputValueToMessagePropType(currentInputValue)
        }
      );
    }


  }

  constructor() { }

  ngOnInit(): void {
  }

  convertEditInputValueToMessagePropType(newEditInputValue: string): Date | string | number {
    let res: Date | string | number = newEditInputValue;

    if (typeof this.displayValue === 'number') {
      res = +newEditInputValue;
    } else if (typeof this.displayValue === 'object') {
      res = new Date(newEditInputValue);
    }

    return res;

  }

}
