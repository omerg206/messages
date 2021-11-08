import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellDisplayComponent } from './cell-display.component';

describe('CellDisplayComponent', () => {
  let component: CellDisplayComponent;
  let fixture: ComponentFixture<CellDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CellDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
