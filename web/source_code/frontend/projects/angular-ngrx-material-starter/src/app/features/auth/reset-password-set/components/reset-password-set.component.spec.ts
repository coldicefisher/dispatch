import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordSetComponent } from './reset-password-set.component';

describe('ResetPasswordSetComponent', () => {
  let component: ResetPasswordSetComponent;
  let fixture: ComponentFixture<ResetPasswordSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
