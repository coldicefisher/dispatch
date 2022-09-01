import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { withLatestFrom, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SiteService } from '../site/site/site.service';
import { ProfileActionTypes } from './actions';
import { LocalStorageService } from '../core.module';
import { AppState } from '../core.state';
import { selectProfileState } from '../core.state';
import { select, Store } from '@ngrx/store';
// import { SiteActionTypes } from '../../site/site/actions';

export const PROFILE_KEY = 'PROFILE';


@Injectable()
export class ProfilePersistStoreEffects {

    constructor(
        private siteService: SiteService, 
        private actions$: Actions, 
        private router: Router,
        private store: Store<AppState>,
        private localStorageService: LocalStorageService

    ) { }
    persistState = createEffect(() => this.actions$.pipe(
        ofType(
            //   ProfileActionTypes.CommitProfile,
            //   ProfileActionTypes.CommitProfileSuccess,
            //   ProfileActionTypes.CommitProfileFailure,
            //   ProfileActionTypes.DeleteProfile,
            //   ProfileActionTypes.DeleteProfileAddressHistory,
            //   ProfileActionTypes.DeleteProfileFailure,
            //   ProfileActionTypes.DeleteProfileSuccess,
            //   ProfileActionTypes.DeleteProfileWorkHistory,
            //   ProfileActionTypes.GetProfile,
            //   ProfileActionTypes.InsertProfileAddressHistory,
            //   ProfileActionTypes.InsertProfileWorkHistory,
            //   ProfileActionTypes.RetrieveUserProfile,
            //   ProfileActionTypes.UpdateProfile,
            //   ProfileActionTypes.UpdateProfileAddressHistory,
            //   ProfileActionTypes.UpdateProfileAddressHistoryField,
            //   ProfileActionTypes.UpdateProfileField,
            //   ProfileActionTypes.UpdateProfileWorkHistory,
            //   ProfileActionTypes.UpdateProfileWorkHistoryField              
            ),
        withLatestFrom(this.store.pipe(select(selectProfileState))),
        tap(([actions, ProfileState]) => {
            
            this.localStorageService.setItem(PROFILE_KEY, ProfileState);
            
        }
        )
    ),
    { dispatch: false }
);
}