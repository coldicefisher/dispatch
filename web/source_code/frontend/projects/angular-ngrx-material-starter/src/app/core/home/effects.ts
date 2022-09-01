import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';

import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from '../core.state';
import { NotificationService } from '../core.module';
import { select } from '@ngrx/store';
// import { AppErrorHandler } from '../error-handler/app-error-handler.service';

import { SocketService } from '../socket/socket.service';
import { actionGetProfile, actionUpdateProfilePermissions } from '../profile/actions';
import { actionConnectSocket } from '../site/site/actions';

import { HomeActionTypes } from './actions';

import { 
    selectHasAdministratorPermission,
    selectProfile
} from '../profile/selectors';

@Injectable()
export class HomeStoreEffects {
  authState$: Observable<any>;
  businessState$: Observable<any>;
  business: any;
  profileState$: Observable<any>;
  profileState: any;
  hasAdminPermissions$: Observable<any>;
  hasAdminPermissions: boolean | undefined;
  currentView$: Observable<any>;
  currentView: string | undefined;

  constructor(
    private actions$: Actions, 
    private router: Router,
    private store: Store<AppState>,
    private notificationService: NotificationService,
    private socketService: SocketService,

  ) { 
    this.profileState$ = this.store.pipe(select(selectProfile));
    this.profileState$.subscribe(res => this.profileState = res);
    this.hasAdminPermissions$ = this.store.pipe(select(selectHasAdministratorPermission));
    this.hasAdminPermissions$.subscribe(res => {
      this.hasAdminPermissions = res
    });
    }

  // navigateFromProfileToDashboardEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
  //   ofType(
  //     HomeActionTypes.NavigateFromProfileToDashboard
  //   ),
  //     tap((action: any) => {
  //       this.router.navigateByUrl('/dashboard');
    
  //       //return observableOf(actionGetBusinessUsers({name: action.name}))
  //     })
  //   ),
  //     { dispatch: false }
  // );

} // END