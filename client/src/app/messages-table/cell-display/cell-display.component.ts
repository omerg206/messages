import { Component, OnInit, ChangeDetectionStrategy, Input, HostListener, EventEmitter, Output, ViewChild, ElementRef, TemplateRef, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { Message } from '../../../../../shared/messages.model';
import { MessageForm } from '../model/message-forms';
import { FormControl } from '@angular/forms';
import { isEqual } from 'lodash'

const EditableMessageKeys: Array<keyof Message> = ["sender", "body", 'status']

@Component({
  selector: 'app-cell-display',
  templateUrl: './cell-display.component.html',
  styleUrls: ['./cell-display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellDisplayComponent implements OnInit {
  @Input() displayKey!: keyof Message;
  @Input() messageId!: string;
  @Input() displayValue: string | number | Date | null | undefined;
  @Input() formDefinition!: MessageForm;
  @Output() editEnd: EventEmitter<Partial<Message> & Pick<Message, '_id'>> = new EventEmitter<Partial<Message> & Pick<Message, '_id'>>();
  temp: any[] = [];
  @ViewChildren(TemplateRef) templates!: QueryList<TemplateRef<any>>;

  isEditMode: boolean = false;
  isOpen: boolean = false //select only
  control: FormControl = new FormControl();
  currentDisplayedTpl!: TemplateRef<any>;

  @HostListener('dblclick', ['$event'])
  onDbClick($event: Event) {
    if (this.formDefinition.isEditable) {
      this.isEditMode = true;
    }

  }

  @HostListener('focusout', ['$event'])
  onFocusOut($event: Event) {
    if (!this.isOpen) {
      const currentInputValue = this.control.value;
      if (this.displayValue != currentInputValue) {

        this.editEnd.emit(
          {
            _id: this.messageId,
            [this.displayKey]: this.convertEditInputValueToMessagePropType(currentInputValue)
          }
        );
      }

      this.isEditMode = false;
    }

  }

  constructor() { }

  ngOnInit(): void {
    this.control.setValue(this.displayValue);


  }

  onOpen($event: any) {
    if ($event) {
      $event.stopPropagation()
      $event.preventDefault()
    }

    this.isOpen = true;


  }

  onClose($event: any) {
    this.isOpen = false;
  }

  onFocusOut2($event: any) {
    if ($event.relatedTarget) {
      this.isOpen = true;
      $event.stopPropagation();
      $event.preventDefault()
    }

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
