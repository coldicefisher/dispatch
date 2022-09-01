import { Component, OnInit, ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, NotificationService, selectUsername } from '../../../../../core/core.module';
import { actionAddAddress } from '../../../../../core/auth/auth/actions';

import { selectAuth } from '../../../../../core/core.module';
import { CustomValidators } from '../../../../../core/validators/custom-validators';

import { OtpOption } from '../../../../../core/auth/auth/state';
import { selectOtpOptions } from '../../../../../core/core.module';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
} from '../../../../../core/core.module';


@Component({
  selector: 'bizniz-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class AddAddressComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private zone: NgZone,
    private notificationService: NotificationService

  ) { }

  authState$: Observable<any>;
  username: string | undefined
  otpOptions$: Observable<OtpOption[]>;
  
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  form = this.fb.group({
    address: [null, Validators.compose([
        CustomValidators.emailOrPhoneValidator({
          validAddress: true
        }),        
        Validators.required
      ])
    ]
  });
  
  ngOnInit() {
    this.authState$ = this.store.pipe(select(selectAuth));
    this.authState$.subscribe((state) => {
      this.username = state.username;
    });

    this.otpOptions$ = this.store.pipe(select(selectOtpOptions));
    
  }

  
  onAddAddress(): void {
    
    let address: string = this.form.get('address').value;
    let id: string | undefined;
    let display: string | undefined;
    
    if (address.includes("@")) {
      let first = address.substring(0, 4);
      let second = address.substring(address.indexOf("@"), address.length);
      display = `Email ${first}...${second}`;
      id = `${first}...${second}`;
    }
    
    else {
      id = address.substring(address.length - 4, address.length);
      display = `Phone number ...${id}`;

    }

    const payload = {
      fullAddress: address,
      username: this.username,
      display: display,
      id: id
    }
    
    let optionExists: boolean = false;

    this.otpOptions$.subscribe(otpOptions => {
      
      for (let option in otpOptions) {
        if (id == otpOptions[option].id) {
          optionExists = true;
          break;
        }
      }
    });

    if (optionExists == false ) {
      this.store.dispatch(actionAddAddress(payload));
    }
    else if ( optionExists == true ) {
      this.notificationService.warn('You have already have this address option');
    }
  }
}
