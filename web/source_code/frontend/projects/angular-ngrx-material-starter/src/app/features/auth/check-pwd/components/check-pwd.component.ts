import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
// import { TranslateService } from '@ngx-translate/core';

import { AppState } from '../../../../core/core.module';
import { actionLogin, actionBeginSignUp } from '../../../../core/auth/auth/actions';
import { selectAuth } from '../../../../core/auth/auth/selectors';


import {
  ROUTE_ANIMATIONS_ELEMENTS,
//  NotificationService
} from '../../../../core/core.module';


@Component({
  selector: 'bizniz-check-pwd',
  templateUrl: './check-pwd.component.html',
  styleUrls: ['./check-pwd.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckPwdComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
//    private notificationService: NotificationService

  ) { }

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  authState$: Observable<any>;
  username: string | undefined;
  device: string | undefined;
  trustThis: string | undefined;
  form = this.fb.group({
    password: ['', [Validators.required]],
  });
  
  ngOnInit() {
  
    this.authState$ = this.store.pipe(select(selectAuth));
    this.authState$.subscribe((state) => {
      this.username = state.username;
      this.trustThis = state.trustThis;
      
    });
    
  }

  onCheck(): void {
    const payload = {
      username: this.username,
      password: this.form.get('password').value,
      trustThis: this.trustThis
    }
    this.store.dispatch(actionLogin(payload));
  }


  onSignUp() {
    this.store.dispatch(actionBeginSignUp());
  }

}
