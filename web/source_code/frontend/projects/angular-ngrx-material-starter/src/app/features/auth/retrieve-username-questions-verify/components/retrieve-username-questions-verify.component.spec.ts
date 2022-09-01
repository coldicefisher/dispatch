import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrieveUsernameQuestionsVerifyComponent } from './retrieve-username-questions-verify.component';

describe('RetrieveUsernameQuestionsVerifyComponent', () => {
  let component: RetrieveUsernameQuestionsVerifyComponent;
  let fixture: ComponentFixture<RetrieveUsernameQuestionsVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetrieveUsernameQuestionsVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveUsernameQuestionsVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
