import { Component, OnInit, ChangeDetectionStrategy, Input, AfterViewInit, AfterContentInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';

import { AppState } from '../../../../core/core.module';
import { actionCheckDevice, actionBeginSignUp, actionRetrieveUsernameStart, actionResetPasswordStart } from '../../../../core/auth/auth/actions';


import {
  ROUTE_ANIMATIONS_ELEMENTS,
} from '../../../../core/core.module';


@Component({
  selector: 'bizniz-check-device',
  templateUrl: './check-device.component.html',
  styleUrls: ['./check-device.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckDeviceComponent implements OnInit, AfterContentInit {
  @Input() name: string;
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,

  ) { }

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  form = this.fb.group({
    username: ['', [Validators.required]],
  });
  
  ngOnInit() {
    
  }
  
  ngAfterContentInit(): void {
    document.getElementById("username").focus();    
  }

  onCheck(): void {
      console.log(`Form: ${this.form.get('username').value}`)
    const payload = {
      username: this.form.get('username').value
    }
    this.store.dispatch(actionCheckDevice(payload));
  }

  onSignUp(): void {
    this.store.dispatch(actionBeginSignUp());
  }
  onRetrieveUsername(): void {
    this.store.dispatch(actionRetrieveUsernameStart());
  }

  onResetPassword(): void {
    this.store.dispatch(actionResetPasswordStart());
  }
}
