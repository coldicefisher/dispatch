import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckDeviceComponent } from './check-device.component';

describe('CheckDeviceComponent', () => {
  let component: CheckDeviceComponent;
  let fixture: ComponentFixture<CheckDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
