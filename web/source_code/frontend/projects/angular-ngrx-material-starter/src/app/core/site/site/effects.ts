import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../core.state';

import { SiteActionTypes } from '../../site/site/actions';
import { FeedSocketService, LocalStorageService } from '../../core.module';
import { NotificationService } from '../../core.module';
import { selectAuthIsAuthenticated } from '../../core.module';

import { SocketService } from '../../core.module';
import { ListenerProfileService } from '../../core.module';
import { ListenerBusinessService } from '../../core.module';
import { ListenerDocumentService } from '../../core.module';
import { ListenerSystemService } from '../../core.module';
import { ListenerSearchService } from '../../socket/listener.search.service';
import { ListenerPublicBusinessService } from '../../core.module';
import { selectBusiness } from '../../business/selectors';


// export const AUTH_KEY = 'AUTH';


@Injectable()
export class SiteEffects {
    private authStatus$: Observable<boolean>;
    private businessStatus$: Observable<any>;

    constructor(
        // private authService: AuthService, 
        private actions$: Actions, 
        private router: Router,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private socketService: SocketService,
        private feedSocketService: FeedSocketService,
        private listenerProfileService: ListenerProfileService,
        private listenerDocumentService: ListenerDocumentService,
        private listenerBusinessService: ListenerBusinessService,
        private listenerSystemService: ListenerSystemService,
        private listenerSearchService: ListenerSearchService,
        private listenerPublicBusinessService: ListenerPublicBusinessService,
        private store: Store<AppState>,
    ) {
        this.authStatus$ = this.store.pipe(select(selectAuthIsAuthenticated));
        this.businessStatus$ = this.store.pipe(select(selectBusiness));
     }

    
    appFailureEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType<any>(
            SiteActionTypes.AppFailure
        ),
        tap((errorCode) => {
            this.notificationService.error('Oops! Something went wrong')
        })
    ),
    { dispatch: false }
    );
    
    connectSocketEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType<any>(
            SiteActionTypes.ConnectSocket
        ),
        tap(() => {
            // Connect to business logic socket
            this.socketService.connect();
            
            this.listenerProfileService.start();
            this.listenerDocumentService.start();
            this.listenerBusinessService.start();
            this.listenerSystemService.start();                
            this.listenerSearchService.start();                                
            this.listenerPublicBusinessService.start();
                        
            // Connect to feed logic socket
            this.feedSocketService.connect();            
        })
            
        ),
            {dispatch: false}
        );
    }
