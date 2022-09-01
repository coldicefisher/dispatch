import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { withLatestFrom, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SiteService } from '../site/site/site.service';
import { BusinessActionTypes } from './actions';
import { LocalStorageService } from '../core.module';
import { AppState } from '../core.state';
import { selectBusinessState } from '../core.state';
import { select, Store } from '@ngrx/store';
import { BusinessState } from './state';
// import { SiteActionTypes } from '../../site/site/actions';

export const BUSINESS_KEY = 'BUSINESS';


@Injectable()
export class BusinessPersistStoreEffects {

    constructor(
        private siteService: SiteService, 
        private actions$: Actions, 
        private router: Router,
        private store: Store<AppState>,
        private localStorageService: LocalStorageService

    ) { }
    persistState = createEffect(() => this.actions$.pipe(
        ofType(
            //   BusinessActionTypes.NavigateFromProfileToDashboard,
            //   BusinessActionTypes.NavigateDashboard
            ),
        withLatestFrom(this.store.pipe(select(selectBusinessState))),
        tap(([actions, BusinessState]) => {
            
            this.localStorageService.setItem(BUSINESS_KEY, BusinessState);
            
        }
        )
    ),
    { dispatch: false }
);
}