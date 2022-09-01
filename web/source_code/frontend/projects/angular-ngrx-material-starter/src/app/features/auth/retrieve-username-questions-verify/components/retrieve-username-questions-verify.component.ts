import { Component, OnInit, ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, NotificationService } from '../../../../core/core.module';
import { actionRetrieveUsernameVerifyQuestions } from '../../../../core/auth/auth/actions';

import { selectAuth } from '../../../../core/core.module';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
} from '../../../../core/core.module';


@Component({
  selector: 'bizniz-retrieve-username-questions-verify',
  templateUrl: './retrieve-username-questions-verify.component.html',
  styleUrls: ['./retrieve-username-questions-verify.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class RetrieveUsernameQuestionsVerifyComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private zone: NgZone,
    private notificationService: NotificationService

  ) { }

  authState$: Observable<any>;
  username: string | undefined;
  address: string | undefined;
  loginStatus: string | undefined;
  q1: string | undefined;
  q2: string | undefined;

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  form = this.fb.group({
    a1: [null, 
        Validators.required
    ],
    a2: [null,
    Validators.required
    ],
  });
  
  ngOnInit() {
    this.authState$ = this.store.pipe(select(selectAuth));
    this.authState$.subscribe((state) => {
      this.address = state.address;
      this.loginStatus = state.loginStatus;
      this.q1 = state.q1;
      this.q2 = state.q2;
    });
    
  }


  onCheck(): void {
    const payload = {
      address: this.address,
      loginStatus: this.loginStatus,
      a1: this.form.get('a1').value,
      a2: this.form.get('a2').value,
    }
    
    this.store.dispatch(actionRetrieveUsernameVerifyQuestions(payload));
       
  }
  

}
