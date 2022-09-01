import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { withLatestFrom, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SiteService } from '../../site/site/site.service';
import { AuthActionTypes } from './actions';
import { LocalStorageService } from '../../core.module';
import { AppState } from '../../core.state';
import { selectAuthState } from '../../core.state';
import { select, Store } from '@ngrx/store';
// import { SiteActionTypes } from '../../site/site/actions';

export const AUTH_KEY = 'AUTH';


@Injectable()
export class AuthPersistStoreEffects {

    constructor(
        private siteService: SiteService, 
        private actions$: Actions, 
        private router: Router,
        private store: Store<AppState>,
        private localStorageService: LocalStorageService

    ) { }
    persistState = createEffect(() => this.actions$.pipe(
        ofType(
                AuthActionTypes.CheckDevice,
                AuthActionTypes.UsernameNotExists,
                AuthActionTypes.DeviceNotTrusted,
                AuthActionTypes.DeviceTrusted,
//                AuthActionTypes.OtpOptions,
                AuthActionTypes.OtpVerify,
                AuthActionTypes.OtpInvalid,
                AuthActionTypes.SendCode,
                AuthActionTypes.SendCodeSuccess,
                AuthActionTypes.SignUp,
                AuthActionTypes.SignUpFailure,
                AuthActionTypes.SignUpSuccess,
                AuthActionTypes.Login,
                AuthActionTypes.LoginFailure,
                AuthActionTypes.LoginSuccess,
                AuthActionTypes.LogOut,
//                AuthActionTypes.AddAddress
                
            ),
        withLatestFrom(this.store.pipe(select(selectAuthState))),
        tap(([actions, AuthState]) => {
            
            this.localStorageService.setItem(AUTH_KEY, AuthState);
            
        }
        )
    ),
    { dispatch: false }
);
}