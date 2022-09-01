import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckPwdComponent } from './check-pwd.component';

describe('CheckPwdComponent', () => {
  let component: CheckPwdComponent;
  let fixture: ComponentFixture<CheckPwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckPwdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
