import { initialState, SiteState } from './state';

import { Action, createReducer, on } from '@ngrx/store';

import * as SiteActions from './actions';
import * as AuthActions from '../../auth/auth/actions';
import * as ImagesActions from '../../images/actions';
import * as ProfileActions from '../../profile/actions';
import * as BusinessActions from '../../business/actions';
import * as FormsActions from '../../forms/actions';
import { state } from '@angular/animations';


const reducer = createReducer(
    initialState,
    /*
    LOADING
    Use the isLoading: true for every http request. For both the return results (Success/Failure), 
    Set isLoading: false
    */
    on(SiteActions.actionIsLoading, (state) => ({ ...state, isLoading: true})),
    // on(actionBeginLogin, (state) =>  ({ ...state, isLoading: true})),
    on(AuthActions.actionCheckDevice,  (state) => ({ ...state, isLoading: true})),
    on(AuthActions.actionSendCode,  (state) => ({ ...state, isLoading: true})),
    on(AuthActions.actionOtpVerify,  (state) => ({ ...state, isLoading: true})),
    on(AuthActions.actionLogin,  (state) => ({ ...state, isLoading: true})),
    on(AuthActions.actionSignUp,  (state) => ({ ...state, isLoading: true})),
    on(AuthActions.actionRetrieveUsernameSendCode, (state) => ({ ...state, isLoading: true})),
    on(AuthActions.actionRetrieveUsernameVerifyCode, (state) => ({ ...state, isLoading: true})),
    on(AuthActions.actionRetrieveUsernameVerifyQuestions, (state) => ({ ...state, isLoading: true})),
    on(AuthActions.actionResetPasswordSendCode, (state) => ({ ...state, isLoading: true})),
    on(AuthActions.actionResetPasswordResetPassword, (state) => ({ ...state, isLoading: true})),

    on(ProfileActions.actionUpdatePassword, (state) => ({ ...state, isLoading: true})),
    on(ProfileActions.actionDeleteProfile, (state) => ({ ...state, isLoading: true})),
    
    // on(ImagesActions.actionImageUpload, (state) => ({ ...state, isLoading: true})),

    //on(BusinessActions.actionCreateBusiness, (state) => ({ ...state, isLoading: true})),

    // Not Loading
    on(SiteActions.actionIsNotLoading, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionBeginLoginSuccess, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionBeginLoginFailure, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionDeviceTrusted, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionOtpOptions, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionOtpInvalid, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionUsernameNotExists, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionSendCodeSuccess, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionOtpVerifySuccess, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionLoginSuccess, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionLoginFailure, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionLogOutSuccess, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionLogOutFailure, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionSignUpSuccess, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionSignUpFailure, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionRetrieveUsernameStart, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionRetrieveUsernameSendCodeSuccess, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionRetrieveUsernameVerifyCodeSuccess, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionRetrieveUsernameVerifyQuestionsSuccess, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionResetPasswordSendCodeSuccess, (state) => ({ ...state, isLoading: false})),
    on(AuthActions.actionResetPasswordResetPasswordSuccess, (state) => ({ ...state, isLoading: false})),

    on(ProfileActions.actionUpdatePasswordSuccess, (state) => ({ ...state, isLoading: false})),
    on(ProfileActions.actionUpdatePasswordFailure, (state) => ({ ...state, isLoading: false})),
    on(ProfileActions.actionDeleteProfileSuccess, (state) => ({ ...state, isLoading: false})),
    on(ProfileActions.actionDeleteProfileFailure, (state) => ({ ...state, isLoading: false})),

    // on(ImagesActions.actionImageUploadSuccess, (state) => ({ ...state, isLoading: false})),
    // on(ImagesActions.actionImageUploadFailure, (state) => ({ ...state, isLoading: false})),

    on(BusinessActions.actionCreateBusinessSuccess, (state) => ({ ...state, isLoading: false})),
    on(BusinessActions.actionCreateBusinessFailure, (state) => ({ ...state, isLoading: false})),

    on(SiteActions.actionAppFailure, (state) => ({ ...state, isLoading: false})),
    

    // on(FormsActions.actionSignedDocumentExists, (state) => ({ ...state, isLoading: false})),
    // on(FormsActions.actionSignedDocumentFailure, (state) => ({ ...state, isLoading: false})),
    // on(FormsActions.actionSignedDocumentSuccess, (state) => ({ ...state, isLoading: false})),
    // on(FormsActions.actionSignedDocumentInvalid, (state) => ({ ...state, isLoading: false})),

);
export function siteReducer(
    state: SiteState | undefined,
    action: Action
) {
    return reducer(state, action);
}
