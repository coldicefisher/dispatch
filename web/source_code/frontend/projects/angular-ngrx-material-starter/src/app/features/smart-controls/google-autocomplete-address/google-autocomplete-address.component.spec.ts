import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleAutocompleteAddressComponent } from './google-autocomplete-address.component';

describe('GoogleAutocompleteAddressComponent', () => {
  let component: GoogleAutocompleteAddressComponent;
  let fixture: ComponentFixture<GoogleAutocompleteAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleAutocompleteAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleAutocompleteAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
