import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnextMenuComponent } from './conext-menu.component';

describe('ConextMenuComponent', () => {
  let component: ConnextMenuComponent;
  let fixture: ComponentFixture<ConnextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnextMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
