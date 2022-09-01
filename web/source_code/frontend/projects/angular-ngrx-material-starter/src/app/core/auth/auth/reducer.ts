import { actionResetPasswordSendCodeSuccess, actionRetrieveUsernameSendCodeSuccess, AuthActionTypes } from './actions';
import { initialState, AuthState } from './state';
//import { persistStore, persistReducer } from 'redux-persist';
//import storage from 'redux-persist/lib/storage';
//import { createStore } from 'redux';


import {
    actionBeginLogin,
    actionCheckDevice,
    actionDeviceNotTrusted,
    actionDeviceTrusted,
    actionUsernameNotExists,
    actionSendCode,
    actionSendCodeSuccess,
    actionGetOtpOptions,
    actionOtpOptions,
    actionOtpVerify,
    actionOtpInvalid,
    actionOtpVerifySuccess,
    actionLogin,
    actionLoginSuccess,
    actionLoginFailure,
    actionLogOut,
    actionLogOutSuccess,
    actionLogOutFailure,
    actionBeginSignUp,
    actionSignUp,
    actionSignUpSuccess,
    actionSignUpFailure,
    actionGetStatus,
    actionAddAddressSuccess,
    actionAddAddress,
    actionRetrieveUsernameStart,
    actionRetrieveUsernameSendCode,
    actionRetrieveUsernameVerifyCodeSuccess,
    actionRetrieveUsernameVerifyQuestionsSuccess,
    actionResetPasswordStart,
    actionResetPasswordSendCode,
    
    
} from './actions';

import { Action, createReducer, on } from '@ngrx/store';

const reducer = createReducer(
    initialState,
    on(actionBeginLogin, (state) => ({ ...state, 
        trustThis: undefined,
        otpOptions: undefined,
        address: undefined,
        loginStatus: "start",
        username: undefined
    
    })),
    on(actionCheckDevice, (state,{username}) => ({ ...state,
        username: username,
        trustThis: undefined,
        otpOptions: undefined,
        address: undefined,
        
        
    })),
    
    on(actionDeviceNotTrusted, (state, {username, loginStatus}) => ({ ...state,
        username: username,
        loginStatus: loginStatus
    })),

    on(actionDeviceTrusted, (state, {username, loginStatus}) => ({...state,
        username: username,
        loginStatus: loginStatus
    })),

   on(actionUsernameNotExists, (state, {username}) => ({ ...state,
        username: username,
        
    })),
    
    on(actionOtpOptions, (state, {otpOptions, username, loginStatus}) => ({ ...state,
        otpOptions: otpOptions,
        username: username,
        loginStatus: loginStatus,
    })),
    
    on(actionGetOtpOptions, (state, {username, loginStatus}) => ({ ...state,
        
        username: username,
        loginStatus: loginStatus,
    })),
    
    
    on(actionSendCode, (state, {username, address,}) => ({ ...state,
        username: username,
        address: address
    })),

    on(actionSendCodeSuccess, (state, { address }) => ({ ...state,
        address: address,
        loginStatus: "verification_sent"
    })),

    on(actionOtpVerify, (state, {username, otpCode, address, trustThis }) => ({ ...state,
        username: username,
        address: address,
        trustThis: trustThis,
    })),

    on(actionOtpInvalid, (state) => ({ ...state,
    })),

    on(actionOtpVerifySuccess, (state, { address }) => ({ ...state,
        address: undefined,
        loginStatus: "trusted_not_authenticated",
        otpOptions: undefined,
    })),

    on(actionLogin, (state, {username}) => ({ ...state,
        username: username,
    })),

    on(actionLoginSuccess, (state) => ({ ...state,
        isAuthenticated: true,
        loginStatus: undefined,
        otpOptions: undefined,
        trustThis: undefined,
    })),

    on(actionLoginFailure, (state) => ({ ...state,
        isAuthenticated: false,
        otpOptions: undefined,
        
    })),

    on(actionLogOut, (state) => ({ ...state,
        isAuthenticated: false,
    })),

    on(actionLogOutSuccess, (state) => ({ ...state,
        isAuthenticated: false,
        username: undefined
    })),

    on(actionLogOutFailure, (state) => ({ ...state,
    })),

    on(actionBeginSignUp, (state) => ({ ...state,
        loginStatus: "sign_up"
    })),

    on(actionSignUp, (state) => ({ ...state,
    
    })),

    on(actionSignUpSuccess, (state) => ({ ...state,
    
    })),

    on(actionSignUpFailure, (state) => ({ ...state,

    })),
    
    on(actionAddAddressSuccess, (state, { id, display }) => ({ ...state,
        //otpOptions: {...state.otpOptions, address}
        //otpOptions: new Map([['dude', 'car']]),
        //username: 'shit'
        
        otpOptions: [
            {
                id: id,
                display: display,
                fullAddress: '',
                status: 'unverified'
                
            },
            ...state.otpOptions
        ]
    })),

    on(actionAddAddress, (state, {id, display, fullAddress }) => ({ ...state,
        //otpOptions: [...state.otpOptions, new Map<string, string>([[id, clientView]]],
        //otpOptions: new Map([[id, clientView]]), ...state.otpOptions
        //otpOptions: [...state.otpOptions],
        
        //username: 'shit'

    })),

    on(actionRetrieveUsernameStart, (state) => ({...state,
        loginStatus: "retrieve_username",
        address: undefined,
        q1: undefined,
        q2: undefined
    })),

    on(actionRetrieveUsernameSendCode, (state, { address, login_status }) => ({ ...state,
        address: address,
    })),

    on(actionRetrieveUsernameSendCodeSuccess, (state) => ({...state,
        loginStatus: "retrieve_username_otp_verify",
        
    })),

    on(actionRetrieveUsernameVerifyCodeSuccess, (state, { q1, q2 }) => ({...state,
        q1: q1,
        q2: q2,
        loginStatus: "retrieve_username_questions_verify",
        
    })),
    
    on(actionRetrieveUsernameVerifyQuestionsSuccess, (state, { username }) => ({...state,
        loginStatus: "start",
        username: username,
        address: undefined,
        q1: undefined,
        q2: undefined
        
    })),

    on(actionResetPasswordStart, (state) => ({...state,
        loginStatus: "reset_password",
        
    })),

    on(actionResetPasswordSendCode, (state, { address, username, loginStatus }) => ({...state,
        address: address,
        username: username,
        loginStatus: loginStatus
    })),
    
    on(actionResetPasswordSendCodeSuccess, (state) => ({...state,
        loginStatus: "reset_password_set",
        
    })),


);

export function authReducer(
    state: AuthState | undefined,
    action: Action
) {
    return reducer(state, action);
    
}

// export const initialOtpOptionsState: OtpOptionsState = {
//   items: [
    
//   ],
//   };

// const otpReducer = createReducer(
//   initialState,
//   on(otpAction.actionTodosAdd, (state, todo) => ({
//     ...state,
//     items: [
//       {
//         id: todo.id,
//         name: todo.name,
//         done: false
//       },
//       ...state.items
//     ]
//   })),
//   on(todoAction.actionTodosToggle, (state, todo) => ({
//     ...state,
//     items: state.items.map((item: Todo) =>
//       item.id === todo.id ? { ...item, done: !item.done } : item
//     )
//   })),
//   on(todoAction.actionTodosRemoveDone, (state, todo) => ({
//     ...state,
//     items: state.items.filter((item: Todo) => !item.done)
//   })),
//   on(todoAction.actionTodosFilter, (state, todo) => ({
//     ...state,
//     filter: todo.filter
//   }))
// );

// export function todosReducer(state: TodosState | undefined, action: Action) {
//   return reducer(state, action);
// }
