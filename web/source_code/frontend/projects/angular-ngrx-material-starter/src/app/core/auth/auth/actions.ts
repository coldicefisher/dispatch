import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

export enum AuthActionTypes {
    BeginLogin = '[Auth] BeginLogin',
    BeginLoginSuccess = '[Auth] BeginLoginSuccess',
    BeginLoginFailure = '[Auth] BeginLoginFailure',
    CheckDevice = '[Auth] CheckDevice',
    UsernameNotExists = '[Auth] UsernameNotExists',
    DeviceNotTrusted = '[Auth] DeviceNotTrusted',
    GetOtpOptions = '[Auth] GetOtpOptions',
    DeviceTrusted = '[Auth] DeviceTrusted',
    OtpOptions = '[Auth] OtpOptions',
    SendCode = '[Auth] SendCode',
    SendCodeSuccess = '[Auth] SendCodeSuccess',
    SendCodeFailure = '[Auth] SendCodeFailure',
    OtpVerify = '[Auth] OtpVerify',
    OtpVerifySuccess = '[Auth] OtpVerifySuccess',
    OtpInvalid = '[Auth] OtpInvalid',
    Login = '[Auth] Login',
    LoginSuccess = '[Auth] LoginSuccess',
    LoginFailure = '[Auth] LoginFailure',
    BeginSignUp = '[Auth] BeginSignUp',
    SignUp = '[Auth] SignUp',
    SignUpSuccess = '[Auth] SignUpSuccess',
    SignUpFailure = '[Auth] SignUpFailure',
    LogOut = '[Auth] LogOut',
    UserUnauthorized = '[Auth] UserUnauthorized',
    LogOutSuccess = '[Auth] LogOutSuccess',
    LogOutFailure = '[Auth] LogOutFailure',
    BeginAddAddress = '[Auth] BeginAddAddres',
    AddAddress = '[Auth] AddAddress',
    AddAddressSuccess = '[Auth] AddAddressSuccess',
    AddAddressFailure = '[Auth] AddAddressFailure',
    EndAddAddress = '[Auth] EndAddAddress',
    RetrieveUsernameStart = '[Auth]RetrieveUsernameStart',
    RetrieveUsernameSendCode = '[Auth] RetrieveUsernameSendCode',
    RetrieveUsernameSendCodeSuccess = '[Auth] RetrieveUsernameSendCodeSuccess',
    RetrieveUsernameVerifyCode = '[Auth] RetrieveUsernameVerifyCode',
    RetrieveUsernameVerifyCodeSuccess = '[Auth] RetrieveUsernameVerifyCodeSuccess',
    RetrieveUsernameVerifyQuestions = '[Auth] RetrieveUsernameVerifyQuestions',
    RetrieveUsernameVerifyQuestionsSuccess = '[Auth] RetrieveUsernameVerifyQuestionsSuccess',
    ResetPasswordStart = '[Auth] ResetPasswordStart',
    ResetPasswordSendCode = '[Auth] ResetPasswordSendCode',
    ResetPasswordSendCodeSuccess = '[Auth] ResetPasswordSendCodeSuccess',
    ResetPasswordResetPassword = '[Auth] ResetPasswordResetPassword',
    ResetPasswordResetPasswordSuccess = '[Auth] ResetPasswordResetPasswordSuccess',

    GetStatus = '[Auth] GetStatus',
}

export const actionBeginLogin = createAction(
    AuthActionTypes.BeginLogin,

);
export const actionBeginLoginSuccess = createAction(
    AuthActionTypes.BeginLoginSuccess
);
export const actionBeginLoginFailure = createAction(
    AuthActionTypes.BeginLoginFailure
);
export const actionCheckDevice = createAction(
    AuthActionTypes.CheckDevice,
    props<{ username: string }>()
);
export const actionUsernameNotExists = createAction(
    AuthActionTypes.UsernameNotExists,
    props<{ username: string }>()
);

export const actionDeviceNotTrusted = createAction(
    AuthActionTypes.DeviceNotTrusted,
    props<{ username: string, loginStatus: string }>()
);

export const actionDeviceTrusted = createAction(
    AuthActionTypes.DeviceTrusted,
    props<{ username: string, loginStatus: string }>()
);

export const actionGetOtpOptions = createAction(
    AuthActionTypes.GetOtpOptions,
    props<{ username: string, loginStatus: string }>()
)
export const actionOtpOptions = createAction(
    AuthActionTypes.OtpOptions,
    props<{ username: string, loginStatus: string, otpOptions: any }>()
);

export const actionSendCode = createAction(
    AuthActionTypes.SendCode,
    props<{ username: string, address: string }>()
);

export const actionSendCodeSuccess = createAction(
    AuthActionTypes.SendCodeSuccess,
    props<{ address: string }>()
);

export const actionSendCodeFailure = createAction(
    AuthActionTypes.SendCodeFailure,
    props<{ address: string }>()
);

export const actionOtpVerify = createAction(
    AuthActionTypes.OtpVerify,
    props<{ username: string, otpCode: string, address: string, trustThis: string }>()
);

export const actionOtpVerifySuccess = createAction(
    AuthActionTypes.OtpVerifySuccess,
    props<{ address: string }>()
);

export const actionOtpInvalid = createAction(
    AuthActionTypes.OtpInvalid,
    // props<{ address: string }>()
);

export const actionLogin = createAction(
    AuthActionTypes.Login,
    props<{ username: string, password: string, trustThis: string }>()
);

export const actionLoginSuccess = createAction(
    AuthActionTypes.LoginSuccess,
    
);

export const actionLoginFailure = createAction(
    AuthActionTypes.LoginFailure,
    props<any>()
);

export const actionLogOut = createAction(
    AuthActionTypes.LogOut,
    props<{ logoutType: number }>()
);

export const actionUserUnauthorized = createAction(
    AuthActionTypes.UserUnauthorized
);

export const actionLogOutSuccess = createAction(
    AuthActionTypes.LogOutSuccess,
    props<{ message: string }>()
);

export const actionLogOutFailure = createAction(
    AuthActionTypes.LogOutFailure,
    props<any>()
);

export const actionGetStatus = createAction(
    AuthActionTypes.GetStatus,
    props<any>()
);

export const actionBeginSignUp = createAction(
    AuthActionTypes.BeginSignUp,
)

export const actionSignUp = createAction(
    AuthActionTypes.SignUp,
    props<{ username: string, password: string, firstName: string, lastName: string, email: string, phone: string, q1: string, a1: string, q2: string, a2: string }>()
);

export const actionSignUpSuccess = createAction(
    AuthActionTypes.SignUpSuccess,
    props<any>()
);

export const actionSignUpFailure = createAction(
    AuthActionTypes.SignUpFailure,
    props<{ error: string }>()
);

export const actionBeginAddAddress = createAction(
    AuthActionTypes.BeginAddAddress,
);

export const actionAddAddress = createAction(
    AuthActionTypes.AddAddress,
    props<{ fullAddress: string, id: string, display: string, username: string }>()
);
export const actionEndAddAddress = createAction(
    AuthActionTypes.EndAddAddress,
);
export const actionAddAddressSuccess = createAction(
    AuthActionTypes.AddAddressSuccess,
    props<{ id: string, display: string }>()
);

export const actionAddAddressFailure = createAction(
    AuthActionTypes.AddAddressFailure,
);

export const actionRetrieveUsernameStart = createAction(
    AuthActionTypes.RetrieveUsernameStart,
);

export const actionRetrieveUsernameSendCode = createAction(
    AuthActionTypes.RetrieveUsernameSendCode,
    props<{ address: string, login_status: string }>()
);

export const actionRetrieveUsernameSendCodeSuccess = createAction(
    AuthActionTypes.RetrieveUsernameSendCodeSuccess,
);

export const actionRetrieveUsernameVerifyCode = createAction(
    AuthActionTypes.RetrieveUsernameVerifyCode,
    props<{ address: string, otpCode: string, loginStatus: string }>()
);

export const actionRetrieveUsernameVerifyCodeSuccess = createAction(
    AuthActionTypes.RetrieveUsernameVerifyCodeSuccess,
    props<{ q1: string, q2: string }>()
);

export const actionRetrieveUsernameVerifyQuestions = createAction(
    AuthActionTypes.RetrieveUsernameVerifyQuestions,
    props<{ address: string, a1: string, a2: string, loginStatus: string }>()
);

export const actionRetrieveUsernameVerifyQuestionsSuccess = createAction(
    AuthActionTypes.RetrieveUsernameVerifyQuestionsSuccess,
    props<{ username: string }>()
);

export const actionResetPasswordStart = createAction(
    AuthActionTypes.ResetPasswordStart,
    
);

export const actionResetPasswordSendCode = createAction(
    AuthActionTypes.ResetPasswordSendCode,
    props<{ username: string, address: string, loginStatus: string }>()
);

export const actionResetPasswordSendCodeSuccess = createAction(
    AuthActionTypes.ResetPasswordSendCodeSuccess,
);

export const actionResetPasswordResetPassword = createAction(
    AuthActionTypes.ResetPasswordResetPassword,
    props<{ password: string, otpCode: string, address: string, loginStatus: string, username: string }>()
);

export const actionResetPasswordResetPasswordSuccess = createAction(
    AuthActionTypes.ResetPasswordResetPasswordSuccess,
);

