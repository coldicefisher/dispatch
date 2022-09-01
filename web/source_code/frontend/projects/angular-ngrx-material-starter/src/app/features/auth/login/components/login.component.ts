import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AppState, ROUTE_ANIMATIONS_ELEMENTS } from '../../../../core/core.module';
import { selectLoginStatus } from '../../../../core/auth/auth/selectors';

@Component({
  selector: 'bizniz-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoginComponent implements OnInit {
  loginStatus$: Observable<string> | undefined;
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  constructor(
    private store: Store<AppState>,
    
  ) { }

  ngOnInit(): void {
    this.loginStatus$ = this.store.pipe(select(selectLoginStatus));    
  
  }

}
