import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';

import { UsersDataActionTypes } from './actions';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { 
  UsersDataState,
  
} from './state';

import { NotificationService } from '../core.module';


import { SocketService } from '../socket/socket.service';

@Injectable()
export class UsersDataStoreEffects {
    authState$: Observable<any>;
    businessState$: Observable<any>;

    constructor(
        private actions$: Actions, 
        private router: Router,
        private storeUsers: Store<UsersDataState>,
        private notificationService: NotificationService,
        // private handler: AppErrorHandler,
        private socketService: SocketService,
    ) { }

    
    getUsersDataEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            UsersDataActionTypes.GetUsersData
        ),
        tap(action => {
            console.log('sending get users data');
            this.socketService.send({
                key: 'search',
                'command': 'get_search_index_data', 
                'payload': {}});
        })
    ),
    { dispatch: false }
    );
      
}