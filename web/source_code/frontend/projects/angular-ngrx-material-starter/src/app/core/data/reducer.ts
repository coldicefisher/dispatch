import produce from "immer";

import { initialState, UsersDataState } from './state';

import {
    actionGetUsersData,
    actionSaveUsersData

} from './actions';


import { Action, createReducer, on } from '@ngrx/store';

const reducer = createReducer(
    initialState,

    on(actionSaveUsersData, (state, action) => ({
            usersByName: action.usersByName
        })
    ),

    
);


export function usersDataReducer(
    state: UsersDataState | undefined,
    action: Action
) {
    return reducer(state, action);
    
}

