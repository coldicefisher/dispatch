import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';
import {
    actionBeginLogin,
    actionBeginLoginSuccess,
    actionBeginLoginFailure,
    actionCheckDevice,
    actionDeviceNotTrusted,
    actionGetOtpOptions,
    actionDeviceTrusted,
    actionLogin,
    actionLoginSuccess,
    actionLoginFailure,
    actionLogOut,
    actionUserUnauthorized,
    actionLogOutFailure,
    actionLogOutSuccess,
    actionOtpOptions,
    actionOtpVerify,
    actionOtpVerifySuccess,
    actionOtpInvalid,
    actionSendCode,
    actionSendCodeSuccess,
    actionSendCodeFailure,
    actionSignUp,
    actionSignUpFailure,
    actionSignUpSuccess,
    actionGetStatus,
    actionUsernameNotExists,
    actionBeginAddAddress,
    actionAddAddress,
    actionAddAddressSuccess,
    actionAddAddressFailure,
    actionRetrieveUsernameStart,
    actionRetrieveUsernameSendCode,
    actionRetrieveUsernameSendCodeSuccess,
    actionRetrieveUsernameVerifyCode,
    actionRetrieveUsernameVerifyCodeSuccess,
    actionRetrieveUsernameVerifyQuestionsSuccess,
    actionResetPasswordStart,
    actionResetPasswordSendCode,
    actionResetPasswordSendCodeSuccess,
    actionResetPasswordResetPassword,
    actionResetPasswordResetPasswordSuccess,
    
} from './actions';


import {
    actionAppFailure
} from '../../site/site/actions';
import { AuthActionTypes } from './actions';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Store } from '@ngrx/store';

import { AuthState, OtpOption } from './state';
//import { OtpOptions } from './state';

// import { LocalStorageService } from '../../core.module';
import { NotificationService } from '../../core.module';

// import { selectAuth } from './selectors';

// import { AppErrorHandler } from '../../error-handler/app-error-handler.service';

import { SocketService } from '../../../core/socket/socket.service';

import { 
    actionGetProfile,
    actionUpdatePassword,
    actionUpdatePasswordFailure,
    actionUpdatePasswordSuccess,
    actionDeleteProfile,
    actionDeleteProfileSuccess,
    actionDeleteProfileFailure,
    ProfileActionTypes,
} from '../../profile/actions';

import { 
    actionUpdateBusinessData 
} from '../../business/actions';

export const AUTH_KEY = 'AUTH';


@Injectable()
export class AuthStoreEffects {
    authState$: Observable<any>;
    

    constructor(
        private authService: AuthService, 
        private actions$: Actions, 
        private router: Router,
        private store: Store<AuthState>,
//        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        //private handler: AppErrorHandler,
        private socketService: SocketService,
        

    ) { }

    
    beginLoginEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType<any>(
            AuthActionTypes.BeginLogin
        ),
        tap(() => {
            this.router.navigateByUrl('login');
        })
    ),
    { dispatch: false}
    );

    checkDeviceEffect$: Observable<Action> = createEffect(() => this.actions$.pipe(
            ofType(
                AuthActionTypes.CheckDevice
            ),
            switchMap(({username}) => {
                
                return this.authService
                .checkDevice(username)
                .pipe(
                    switchMap((resp) => {
                        console.log(resp['username']);
                        if (resp['login_status'] == 'trusted_not_authenticated') {
                            
                            return observableOf(actionDeviceTrusted({ username: resp['username'], loginStatus: resp['login_status'] }));
                        }
                        else if (resp['login_status'] == 'not_trusted_not_authenticated') {
                            return observableOf(actionDeviceNotTrusted({ username: resp['username'], loginStatus: resp['login_status'] }));
                        }
                        else {
                            return observableOf(actionLoginFailure({ error: 'unknown' }));
                        };
                    }),
                    // catchError((error: HttpErrorResponse) => {
                    //     if (error.status == 417 || error.status == 400) {
                    //         return observableOf(actionAppFailure({error: 'failed'}));
                    //     }
                    //     else {
                    //         return observableOf(actionUsernameNotExists({ username: '' }));
                    //     }
                    // })
                );
            })
        )
    );

    deviceNotTrustedEffect$: Observable<Action> = createEffect(() => this.actions$.pipe(
            ofType<any>(
                AuthActionTypes.DeviceNotTrusted
            ),
            switchMap(({username, loginStatus}) => {
                return observableOf(actionGetOtpOptions({username: username, loginStatus: loginStatus}));
                
            }),
                                      
        )
    );

    getOtpOptionsEffect$: Observable<Action> = createEffect(() => this.actions$.pipe(
            ofType<any>(
                AuthActionTypes.GetOtpOptions
            ),
            switchMap(({username, loginStatus}) => {
                return this.authService
                .getOptions(username)
                .pipe(
                    switchMap((resp) => {
                        return observableOf(actionOtpOptions({username: resp['username'], loginStatus: resp['login_status'], otpOptions: resp['otp_options']}));
                    })
                )
            })
        )
    );

    sendCodeEffect$: Observable<Action> = createEffect(() => this.actions$.pipe(
            ofType<any>(
                AuthActionTypes.SendCode
            ),
            switchMap(({ username, address }) => {
                return this.authService
                .sendCode(username, address)
                .pipe(
                    switchMap((resp) => {
                        
                        return observableOf(actionSendCodeSuccess({ address: address }));
                    }),
                    
                );
            })
        )
    );

    sendCodeSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType<any>(
            AuthActionTypes.SendCodeSuccess
        ),
        tap(() => {
            console.log(this.router.url);
            this.router.navigateByUrl('/login');
        })
    ),
    { dispatch: false}
    );

    sendCodeFailureEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType<any>(
            AuthActionTypes.SendCodeFailure
        ),
        tap((address) => {
            
            this.notificationService.error(`One time passcode failed to send to ${address}`);
        })
    ),
    { dispatch: false}
    );

    otpVerifyEffect$: Observable<Action> = createEffect(() => this.actions$.pipe(
            ofType<any>(
                AuthActionTypes.OtpVerify
            ),
            switchMap(({ username, otpCode, address}) => {
                return this.authService
                .otpVerify(username, otpCode, address)
                .pipe(
                    switchMap((resp) => {
                        console.log(resp.status)
                        return observableOf(actionOtpVerifySuccess({ address: address }));
                    }),
                    catchError((error: HttpErrorResponse) => {
                        let errStr = String(error.error['message']);
                        
                        switch (errStr) {

                            case "address_registered":
                                this.notificationService.warn("Address is verified by another user. If this is you, then remove it from your other account");
                                return observableOf(actionOtpInvalid());
                        
                            case "otp_code_expired":
                                this.notificationService.warn("OTP code expired.");
                                return observableOf(actionDeviceNotTrusted({username: username, loginStatus: "start" }));
                        
                        
                            case "invalid_code":
                                this.notificationService.warn("Passcode is invalid");
                                return observableOf(actionOtpInvalid());
                        
                            default:
                                return observableOf(actionAppFailure({ errorCode: error.status }));
                            //     return observableOf(actionAppFailure({error: "Application encountered a fatal error."}));
                            // }
                        }
                        
                    })
                );
            })
        )
    );

    otpInvalidEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
            ofType<any>(
                AuthActionTypes.OtpInvalid
            ),
            tap((address) => {
                this.notificationService.warn('Passcode is invalid');
            })
        ),
        { dispatch: false }
    );

    otpVerifySuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
            ofType<any>(
                AuthActionTypes.OtpVerifySuccess
            ),
            tap(action => {
                
                this.notificationService.info(`${action.address} successfully verified`);
            })
        ),
        { dispatch: false }
    );
    
    loginEffect$ = createEffect(() => this.actions$.pipe(
            ofType(
                AuthActionTypes.Login
            ),
            switchMap(({ username, password, trustThis }) => {
                
                return this.authService
                .login(username, password, trustThis)
                .pipe(
                    switchMap(() => {
                        return observableOf(actionLoginSuccess());

                    }),
                    catchError((error: HttpErrorResponse) => {
                        if (error.status == 401) {
                            this.notificationService.warn("Invalid username/password combination");
                            return observableOf(actionLoginFailure({ username: username }));
                        }
                        else {
                            return observableOf(actionAppFailure({ errorCode: error.error }));
                        }
                        // else {
                        //     return observableOf(actionAppFailure({ error: error.statusText }));
                        // }
                    })
                )
            })
        )
    );
 
    loginSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
            ofType<any>(
                AuthActionTypes.LoginSuccess
            ),
            tap(() => {
                
                this.notificationService.success(`Successfully logged in`);
                this.socketService.connect();
                
                this.store.dispatch(actionGetProfile());
                
                
                //this.router.navigateByUrl('/');
                location.href = "/";
            })
        ),
        { dispatch: false }
    );

    loginFailureEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
            ofType<any>(
                AuthActionTypes.LoginFailure
            ),
            tap(() => {
                
                this.notificationService.warn('Username/password combination does not match')
            })
        ),
        { dispatch: false }
    );

    beginSignUpEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType<any>(
            AuthActionTypes.BeginSignUp
        ),
            tap(() => {
                this.router.navigateByUrl('/register');
            })
        ),
        { dispatch: false }
    );

    signUpEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            AuthActionTypes.SignUp
        ),
        switchMap(({ username, password, firstName, lastName, email, phone, q1, a1, q2, a2 }) => {
            return this.authService
            .signUp(username, password, firstName, lastName, email, phone, q1, a1, q2, a2)
            .pipe(
                switchMap(() => {
                    return observableOf(actionSignUpSuccess({ username: username, loginStatus: 'not_trusted_not_authenticated' }));
                }),
                catchError((error: HttpErrorResponse) => {
                    
                    let errStr = String(error.error['message']);
                    if (error.status == 409) {
                        return observableOf(actionSignUpFailure({ error: errStr }));
                        
                    }
                    else {
                        return observableOf(actionAppFailure({ errorCode: error.status }));
                    }
                })
            )
        })
    ));

    signUpSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
            ofType<any>(
                AuthActionTypes.SignUpSuccess
            ),
            switchMap(({ username, loginStatus }) => {
                    this.notificationService.success(`Account successfully created`);
                    this.router.navigateByUrl('/login');
                    return observableOf(actionDeviceNotTrusted({ username: username, loginStatus: loginStatus }));
            }),
        ),
        
    );

    signUpFailureEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
            ofType<any>(
                AuthActionTypes.SignUpFailure
            ),
        
        tap(action => {
                switch (action.error) {
                    case 'username_exists':
                        this.notificationService.warn("Username is already registered. Please select another username.");
                        break;
                    case 'email_registered':
                        this.notificationService.warn("Email is already registered.");
                        break;
                    case 'phone_registered':
                        this.notificationService.warn('Phone number is already registered');
                        break
                    default:
                        this.notificationService.error('Oops! Something went wrong...');
                        break;

                }
                
            })
        ),
        { dispatch: false }
    );

    logOutEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
            ofType<any>(
                AuthActionTypes.LogOut
            ),
            switchMap((action: any) => {
            return this.authService
                .logout()
                .pipe(
                    switchMap((resp) => {
                        
                        switch (action.logoutType) {
                            case 1:
                                return observableOf(actionLogOutSuccess({ message: "You have successfully logged out" }));
                                break;
                            case 2:
                                return observableOf(actionLogOutSuccess({  message: "You successfully deleted your account"  }));
                                break;
                            case 3:
                                return observableOf(actionLogOutSuccess({  message: "You are unauthorized to view this" }));
                                break;
                            default:
                                return observableOf(actionLogOutSuccess({ message: "You have successfully logged out"  }));
                                break;
                        }
                        
                    }),
                )
            })
        )
    );

    // UserUnauthorizedEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    //     ofType<any>(
    //         AuthActionTypes.LogOut
    //     ),
    //     switchMap((action: any) => {
    //     return this.authService
    //         .logout()
    //         .pipe(
    //             switchMap((resp) => {
    //                 return observableOf(actionLogOutSuccess({ }));
    //             }),
    //         )
    //     })
    // )
    // );

    logoutSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType<any>(
            AuthActionTypes.LogOutSuccess
        ),
        tap(action => {
            localStorage.clear();
            this.notificationService.info(action.message);        
            this.router.navigateByUrl('/');
        })
    ),
        { dispatch: false }
    );

    getStatusEffect: Observable<any> = createEffect(() => this.actions$.pipe(
            ofType<any>(
                AuthActionTypes.GetStatus
            ),
            switchMap((payload) => {
                return this.authService.getStatus();
            })
        ),
        { dispatch: false }
    );

    addAddressEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            AuthActionTypes.AddAddress
        ),
        switchMap((action: any) => {
        return this.authService
            .addAddress(action.fullAddress, action.username)
            .pipe(
                switchMap((resp) => {
                    return observableOf(actionAddAddressSuccess({ id: action.id, display: action.display }));
                }),
                catchError((error: HttpErrorResponse) => {
                    let errStr = String(error.error['message']);
                
                    if (errStr = "address_registered_to_another_user") {
                        this.notificationService.warn("Address is verified by another user. If this is you, then remove it from your other account");
                        return observableOf(actionAddAddressFailure());
                    }
                    else {
                        return observableOf(actionAppFailure({ errorCode: error.status }));
                    //     return observableOf(actionAppFailure({error: "Application encountered a fatal error."}));
                    // }
                    }
                })
            )
        })
    ));
    
    addAddressSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            AuthActionTypes.AddAddressSuccess
        ),
        tap(action => {
            this.notificationService.success('Address successfully added');
            
        })
    ),
    { dispatch: false }
    );    

    retrieveUsernameSendCodeEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            AuthActionTypes.RetrieveUsernameSendCode
        ),
        switchMap((action: any) => {
            return this.authService
                .retrieveUsernameSendCode(action.address)
                .pipe(
                    switchMap((resp) => {
                        this.notificationService.success('Verification code sent to address');
                        return observableOf(actionRetrieveUsernameSendCodeSuccess());
                    }),
                    catchError((error: HttpErrorResponse) => {
                        let errStr = String(error.error['message']);
                    
                        switch (errStr) {
                            case "address_registered_to_another_user":
                                //this.notificationService.warn("Address is verified by another user. If this is you, then remove it from your other account");
                                return observableOf(actionRetrieveUsernameSendCodeSuccess());
                                break;
                            case "address_not_registered":
                                this.notificationService.success('Verification code sent to address');
                                return observableOf(actionRetrieveUsernameSendCodeSuccess());
                                break;
                            default:
                                return observableOf(actionAppFailure({ errorCode: error.status }));
                                break;
                                
                        //     return observableOf(actionAppFailure({error: "Application encountered a fatal error."}));
                        // }
                        }
                    })
                )
            })
    ));

    retrieveUsernameSendCodeSuccess: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            AuthActionTypes.RetrieveUsernameSendCodeSuccess
        ),
        tap((action: any) => {
            this.notificationService.info("Check the device you entered for a code");
        })
        ),
        { dispatch: false }
    )
    retrieveUsernameVerifyCodeEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            AuthActionTypes.RetrieveUsernameVerifyCode
        ),
        switchMap((action: any) => {
            return this.authService
                .retrieveUsernameVerifyCode(action.address, action.otpCode.toString(), action.loginStatus)
                .pipe(
                    switchMap((resp) => {
                        return observableOf(actionRetrieveUsernameVerifyCodeSuccess({ q1: resp.q1, q2: resp.q2 }));
                    }),
                    catchError((error: HttpErrorResponse) => {
                        let errStr = String(error.error['message']);
                    
                        switch (errStr) {
                            case "address_registered_to_another_user":
                                this.notificationService.warn("Address is verified by another user. If this is you, then remove it from your other account");
                                return observableOf(actionRetrieveUsernameStart());
                            case "address_not_verified":
                                this.notificationService.warn("Address has not been verified");
                                return observableOf(actionRetrieveUsernameStart());
                            case "otp_invalid":
                                this.notificationService.warn("OTP code invalid");
                                return observableOf(actionOtpInvalid());
                        
                            default:
                                return observableOf(actionRetrieveUsernameStart);    
                            //return observableOf(actionAppFailure({ errorCode: error.status }));
                                
                        //     return observableOf(actionAppFailure({error: "Application encountered a fatal error."}));
                        // }
                        }
                    })
                )
        })
    ));

    retrieveUsernameVerifyQuestionsEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            AuthActionTypes.RetrieveUsernameVerifyQuestions
        ),
        switchMap((action: any) => {
            return this.authService
                .retrieveUsernameVerifyQuestions(action.address, action.a1, action.a2, action.loginStatus)
                .pipe(
                    switchMap((resp) => {
                        return observableOf(actionRetrieveUsernameVerifyQuestionsSuccess({ username: resp.username }));
                    }),
                    catchError((error: HttpErrorResponse) => {
                        let errStr = String(error.error['message']);
                    
                        switch (errStr) {
                            case "undefined":
                                this.notificationService.warn("Verification failed");
                                return observableOf(actionRetrieveUsernameStart());
                            default:
                                return observableOf(actionAppFailure({ errorCode: error.status }));
                                
                        //     return observableOf(actionAppFailure({error: "Application encountered a fatal error."}));
                        // }
                        }
                    })
                )
        })
    ));
      
    retrieveUsernameVerifyQuestionsSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            AuthActionTypes.RetrieveUsernameVerifyQuestionsSuccess
        ),
        tap(action => {
            this.notificationService.success('Your username has been sent to your device');
        })
    ),
    { dispatch: false }
    );

    resetPasswordSendCodeEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            AuthActionTypes.ResetPasswordSendCode
        ),
        switchMap((action: any) => {
            return this.authService
                .resetPasswordSendCode(action.address, action.username, action.loginStatus)
                .pipe(
                    switchMap((resp) => {
                        return observableOf(actionResetPasswordSendCodeSuccess());
                    }),
                    catchError((error: HttpErrorResponse) => {
                        let errStr = String(error.error['message']);
                    
                        switch (errStr) {
                            case "undefined":
                                this.notificationService.warn("Verification failed");
                                return observableOf(actionResetPasswordStart());
                            default:
                                return observableOf(actionAppFailure({ errorCode: error.status }));
                                
                        //     return observableOf(actionAppFailure({error: "Application encountered a fatal error."}));
                        // }
                        }
                    })
                )
        })
    ));

    resetPasswordResetPasswordEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            AuthActionTypes.ResetPasswordResetPassword
        ),
        switchMap((action: any) => {
            return this.authService
                .resetPasswordResetPassword(action.password, action.otpCode, action.loginStatus, action.address, action.username)
                .pipe(
                    switchMap((resp) => {
                        this.notificationService.success("Password has been set");
                        return observableOf(actionResetPasswordResetPasswordSuccess());
                    }),
                    catchError((error: HttpErrorResponse) => {
                        let errStr = String(error.error['message']);
                    
                        switch (errStr) {
                            case "otp_invalid":
                                this.notificationService.warn("Verification failed");
                                return observableOf(actionResetPasswordStart());
                            default:
                                this.notificationService.warn("Verification failed");
                                return observableOf(actionAppFailure({ errorCode: error.status }));
                                
                        //     return observableOf(actionAppFailure({error: "Application encountered a fatal error."}));
                        // }
                        }
                    })
                )
        })
    ));

    resetPasswordResetPasswordSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            AuthActionTypes.ResetPasswordResetPasswordSuccess
        ),
        switchMap((action: any) => {
            this.notificationService.success("You succesffully changed your password");
            return observableOf(actionBeginLogin());
        })
    ));
    
    updatePasswordEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            ProfileActionTypes.UpdatePassword
        ),
        switchMap((action: any) => {
            return this.authService
                .updatePassword(action.currentPassword, action.newPassword)
                .pipe(
                    switchMap((resp) => {
                        return observableOf(actionUpdatePasswordSuccess());
                    }),
                    catchError((error: HttpErrorResponse) => {
                        return observableOf(actionUpdatePasswordFailure());
                    }),
                )
            })
        ));

    updatePasswordSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            ProfileActionTypes.UpdatePasswordSuccess
        ),
        tap((action: any) => {
            this.notificationService.success('Password successfully updated');
        })
        ),
            { dispatch: false }

    );

    updatePasswordFailureEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            ProfileActionTypes.UpdatePasswordFailure
        ),
        tap((action: any) => {
            this.notificationService.error('Password failed to update');
        }),
        ),
            { dispatch: false }

    );


    deleteProfileEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            ProfileActionTypes.DeleteProfile
        ),
        switchMap((action: any) => {
            return this.authService
                .deleteProfile()
                .pipe(
                    switchMap((resp) => {
                        return observableOf(actionDeleteProfileSuccess());
                    }),
                    catchError((error: HttpErrorResponse) => {
                        return observableOf(actionDeleteProfileFailure());
                    }),
                )
            })
    ));
    
    deleteProfileSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            ProfileActionTypes.DeleteProfileSuccess
        ),
        switchMap((action: any) => {
            //this.notificationService.success('You successfully deleted your account');
            return observableOf(actionLogOut({ logoutType: 3 }));
        }),
        
        ),
    )

    deleteProfileFailureEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
            ProfileActionTypes.DeleteProfileFailure
        ),
        tap((action: any) => {
            this.notificationService.error('Something went wrong with deleting your account');
        })
        ),
            { dispatch: false }
    )

// END AUTHSTORE EFFECTS
}



