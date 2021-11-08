import { Component, OnInit, ChangeDetectionStrategy, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-cell-display',
  templateUrl: './cell-display.component.html',
  styleUrls: ['./cell-display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellDisplayComponent implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() displayValue: string | number | Date | null | undefined;

  @HostListener('dbclick', ['$event'])
  onDbClick($event: Event) {
    debugger
  }
  constructor() { }

  ngOnInit(): void {
  }

}
