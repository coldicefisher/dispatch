import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessDashboardComponent } from './business-dashboard.component';

describe('BusinessDashboardComponent', () => {
  let component: BusinessDashboardComponent;
  let fixture: ComponentFixture<BusinessDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
