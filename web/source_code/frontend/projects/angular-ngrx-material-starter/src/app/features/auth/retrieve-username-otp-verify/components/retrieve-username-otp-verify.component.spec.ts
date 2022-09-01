import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrieveUsernameOtpVerifyComponent } from './retrieve-username-otp-verify.component';

describe('RetrieveUsernameOtpVerifyComponent', () => {
  let component: RetrieveUsernameOtpVerifyComponent;
  let fixture: ComponentFixture<RetrieveUsernameOtpVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetrieveUsernameOtpVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveUsernameOtpVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
