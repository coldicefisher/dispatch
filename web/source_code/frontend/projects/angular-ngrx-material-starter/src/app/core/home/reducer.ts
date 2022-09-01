import produce, { current } from "immer";

import { initialState, HomeState } from './state';


import { actionNavigateHomeView, actionUpdateBusinesses } from './actions';

import { actionGetProfile } from "../profile/actions";

import { Action, createReducer, on } from '@ngrx/store';


import * as lodash from 'lodash';

import { userInfo } from "os";

const reducer = createReducer(
  initialState,
  
  on(actionNavigateHomeView, (state, action) => ({
      ...state,
      currentView: action.route
    })
  ),

  on(actionUpdateBusinesses, (state, action) => ({
      ...state,
      businesses: action.businesses,
      homeLoading: false,
    })
  ),
);
export function homeReducer(
    state: HomeState | undefined,
    action: Action
) {
    return reducer(state, action);
    
}

