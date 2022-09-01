import { Component, OnInit, ChangeDetectionStrategy, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AppState, ROUTE_ANIMATIONS_ELEMENTS } from '../../../../core/core.module';

import { selectLoginStatus } from '../../../../core/auth/auth/selectors';

@Component({
  selector: 'bizniz-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class RegisterComponent implements OnInit {
  loginStatus$: Observable<string> | undefined;
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  
  authState$: Observable<any>;

  constructor(
    private store: Store<AppState>,
    
  ) { }

  ngOnInit(): void {
    this.loginStatus$ = this.store.pipe(select(selectLoginStatus));    
  
  }

}
