import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessesSummaryComponent } from './businesses-summary.component';

describe('BusinessesSummaryComponent', () => {
  let component: BusinessesSummaryComponent;
  let fixture: ComponentFixture<BusinessesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessesSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
