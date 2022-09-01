import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpOptionsComponent } from './otp-options.component';

describe('OtpOptionsComponent', () => {
  let component: OtpOptionsComponent;
  let fixture: ComponentFixture<OtpOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
