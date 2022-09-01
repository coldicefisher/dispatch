import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';

import { ProfileActionTypes } from './actions';
import { Router } from '@angular/router';
import { ProfileService } from './profile.service';

import { Store } from '@ngrx/store';

import { ProfileState } from './state';


import { NotificationService } from '../core.module';

// import { AppErrorHandler } from '../error-handler/app-error-handler.service';

export const AUTH_KEY = 'AUTH';

import { SocketService } from '../socket/socket.service';
import { actionGetBusinessData } from '../business/actions';

@Injectable()
export class ProfileStoreEffects {
    authState$: Observable<any>;
    

    constructor(
        private profileService: ProfileService, 
        private actions$: Actions, 
        private router: Router,
        private store: Store<ProfileState>,
//        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        // private handler: AppErrorHandler,
        private socketService: SocketService,
    ) { }

    
    navigateToProfilePageEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            ProfileActionTypes.NavigateToProfilePage
        ),
        tap(action => {
            this.router.navigateByUrl('/profile');
        })
    ),
    { dispatch: false }
    );
      
    getProfileEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            ProfileActionTypes.GetProfile
        ),
        tap((action: any) => {
            this.socketService.send({
                key: 'profile',
                'command': 'get_profile', 
                'payload': {}});
            
        })
    ),
        { dispatch: false }
    );
      
    getProfileSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            ProfileActionTypes.GetProfileSuccess
        ),
        tap((action: any) => {
            if (action.defaultBusiness && action.defaultBusiness != undefined && action.defaultBusiness != null && action.defaultBusiness != "") {
                this.store.dispatch(actionGetBusinessData({ businessName: action.defaultBusiness }))
            }
            // this.notificationService.info("Profile information loaded")
            
        })
    ),
        { dispatch: false }
    );
  
      
    commitProfileEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            ProfileActionTypes.CommitProfile
        ),
        tap((action: any) => {
                let payload = {
                    'id': action.id,
                    'firstName': action.firstName,
                    'middleName': action.middleName,
                    'lastName': action.lastName,
                    'suffix': action.suffix,
                    'gender': action.gender,
                    'workHistories': action.workHistories,
                    'addresses': action.addresses,
                    'images': action.images,
                    'privacyStatus': action.privacyStatus,
                    'seekingStatus': action.seekingStatus

                }
                
                this.socketService.send({ 
                    key: 'profile',
                    'command': 'commit_profile', 'payload': payload }); 
            }),            
        ),
        { dispatch: false }
    );

    

    commitProfileSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            ProfileActionTypes.CommitProfileSuccess
        ),
        tap(action => {
            //this.notificationService.success("Profile updated successfully")
            
        })
    ),
        { dispatch: false }
    );

    
    // retrieveUsernameVerifyQuestionsSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    //     ofType(
    //         AuthActionTypes.RetrieveUsernameVerifyQuestionsSuccess
    //     ),
    //     tap(action => {
    //         this.notificationService.success('Your username has been sent to your device');
    //     })
    // ),
    // { dispatch: false }
    // );

    // resetPasswordResetPasswordEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    //     ofType(
    //         AuthActionTypes.ResetPasswordResetPassword
    //     ),
    //     switchMap((action: any) => {
    //         return this.authService
    //             .resetPasswordResetPassword(action.password, action.otpCode, action.loginStatus, action.address, action.username)
    //             .pipe(
    //                 switchMap((resp) => {
    //                     this.notificationService.success("Password has been set");
    //                     return observableOf(actionResetPasswordResetPasswordSuccess());
    //                 }),
    //                 catchError((error: HttpErrorResponse) => {
    //                     let errStr = String(error.error['message']);
                    
    //                     switch (errStr) {
    //                         case "otp_invalid":
    //                             this.notificationService.warn("Verification failed");
    //                             return observableOf(actionResetPasswordStart());
    //                         default:
    //                             this.notificationService.warn("Verification failed");
    //                             return observableOf(actionAppFailure({ errorCode: error.status }));
                                
    //                     //     return observableOf(actionAppFailure({error: "Application encountered a fatal error."}));
    //                     // }
    //                     }
    //                 })
    //             )
    //     })
    // ));


// END AUTHSTORE EFFECTS
}



