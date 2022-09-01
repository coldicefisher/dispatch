import { 
  Component, 
  OnInit, 
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  AfterViewInit
} from '@angular/core';

import { } from '@angular/google-maps';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';


@Component({
  selector: 'GoogleAutoAddress',
  templateUrl: './google-autocomplete-address.component.html',
  styleUrls: ['./google-autocomplete-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GoogleAutocompleteAddressComponent implements OnInit, AfterViewInit {
  @Input() addressType: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addressText') addressText: any;

  //autoCompleteInput: FormControl;
  queryWait: boolean;

  constructor(
    private fb: FormBuilder,
  ) 
  {
    //this.autoCompleteInput = new FormControl();
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
      this.getPlaceAutocomplete();
  }
  form = this.fb.group({
    autocompleteInput: [null, ],
  })

  private getPlaceAutocomplete() {
    const autoComplete = new google.maps.places.Autocomplete(this.addressText.nativeElement,
        {
            componentRestrictions: { country: 'US' },
            types: [this.addressType]  // 'establishment' / 'address' / 'geocode'
        });
    google.maps.event.addListener(autoComplete, 'place_changed', () => {
        const place = autoComplete.getPlace();
        this.invokeEvent(place);
    });
  }

  invokeEvent(place: Object) {
    this.setAddress.emit(place);
  }

}
