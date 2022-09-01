import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchingComponent } from './dispatching.component';

describe('DispatchingComponent', () => {
  let component: DispatchingComponent;
  let fixture: ComponentFixture<DispatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
