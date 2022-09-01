import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { identity, Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';

import { ImageActionTypes } from './actions';
import { Router } from '@angular/router';
import { ImageService } from './image-service';

import { Store } from '@ngrx/store';

import { AuthState } from '../auth/auth/state';


import { NotificationService } from '../core.module';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';


export const AUTH_KEY = 'AUTH';

import { SocketService } from '../socket/socket.service';

//import { AppErrorHandler } from '../error-handler/app-error-handler.service';


@Injectable()
export class ImageStoreEffects {
    authState$: Observable<any>;
    

    constructor(
        private imageService: ImageService, 
        private actions$: Actions, 
        private router: Router,
        private store: Store<AuthState>,

        private notificationService: NotificationService,
        // private handler: AppErrorHandler,
        private socketService: SocketService,
    ) { }

    // imageUploadEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    //     ofType(
    //         ImageActionTypes.ImageUpload
    //     ),
    //     switchMap(({image}) => {
    //         return this.imageService
    //             .uploadImage(image)
    //             .pipe(
                    
    //                 switchMap((resp) => {
    //                     console.log('sup');
    //                     return observableOf(actionImageUploadSuccess({fileName: 'dummy file.png'}));
    //                 }),
    //                 catchError((error: HttpErrorResponse) => {
    //                     let errStr = String(error.error['message']);
    //                     return observableOf(actionImageUploadFailure({ fileName: 'dummy file.png' }));
                                
    //                 })
    //             )
    //     })
    // ));
    
    // imageUploadToCloudflareEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    //     ofType(
    //         ImageActionTypes.ImageUploadToCloudflare
    //     ),
    //     switchMap(({image}) => {
    //         return this.imageService
    //             .uploadImageToCloudflare(image)
    //             .pipe(
                    
    //                 switchMap((resp) => {
    //                     console.log('sup cloudflare');
    //                     console.log(resp);
    //                     return observableOf(actionImageUploadSuccess({fileName: 'dummy file.png'}));
    //                 }),
    //                 catchError((error: HttpErrorResponse) => {
    //                     console.log(error);
    //                     //let errStr = String(error.error['message']);
    //                     return observableOf(actionImageUploadFailure({ fileName: 'dummy file.png' }));
                                
    //                 })
    //             )
    //     })
    // ));

    // imageUploadSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    //     ofType(
    //         ImageActionTypes.ImageUploadSuccess
    //     ),
    //     tap((action: any) => {
    //         this.notificationService.success(`${action.fileName} successfully uploaded`);
    //     })
    // ),
    //     { dispatch: false }
    // );


    // imageUploadFailureEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    //     ofType(
    //         ImageActionTypes.ImageUploadFailure
    //     ),
    //     tap((action: any) => {
    //         this.notificationService.error(`${action.fileName} failed to upload`);
    //     })
    // ),
    // { dispatch: false }
    // );
    

    processImageInfoFromUploadCareEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            ImageActionTypes.ProcessProfileImageInfoFromUploadCare
        ),
        tap((action: any) => {
            // let payload = {
            //     'id': action.id,
            //     'imageType': action.imageType,
            //     'uuid': action.uuid,
            //     'originalUrl': action.originalUrl,
            //     'cdnUrl': action.cdnUrl,
            //     'name': action.name,
            //     'mimeType': action.mimeType,
            //     'size': action.size
            // }
    
            // this.socketService.send(payload);
        })
    ),
        { dispatch: false }
    );

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



