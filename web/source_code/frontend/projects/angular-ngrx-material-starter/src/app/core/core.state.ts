import {
  ActionReducerMap,
  MetaReducer,
  createFeatureSelector
} from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import { environment } from '../../environments/environment';

import { initStateFromLocalStorage } from './meta-reducers/init-state-from-local-storage.reducer';
import { debug } from './meta-reducers/debug.reducer';

// AUTH STATE ////////////////////////////////////////////////////
import { AuthState } from './auth/auth/state';
import { SiteState } from './site/site/state';
import { authReducer } from './auth/auth/reducer';
import { siteReducer } from './site/site/reducer';
import { RouterStateUrl } from './router/router.state';
import { settingsReducer } from './settings/settings.reducer';
import { SettingsState } from './settings/settings.model';
// END AUTH STATE ////////////////////////////////////////////////

// PROFILE STATE /////////////////////////////////////////////////
import { ProfileState } from './profile/state';
import { profileReducer } from './profile/reducer';
// END PROFILE STATE /////////////////////////////////////////////

// BUSINESS STATE ////////////////////////////////////////////////
import { businessReducer } from './business/reducer';
import { BusinessState } from './business/state';
// END BUSINESS STATE ////////////////////////////////////////////

// Search Index State ////////////////////////////////////////////
import { usersDataReducer } from './data/reducer';
import { UsersDataState } from './data/state';
// End Search Index State ////////////////////////////////////////

// Forms State ///////////////////////////////////////////////////
import { formsReducer } from './forms/reducer';
import { FormsState } from './forms/state';
//////////////////////////////////////////////////////////////////

// Home State ////////////////////////////////////////////////////
import { HomeState } from './home/state';
import { homeReducer } from './home/reducer';
//////////////////////////////////////////////////////////////////

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  site: siteReducer,
  settings: settingsReducer,
  profile: profileReducer,
  business: businessReducer,
  forms: formsReducer,
  usersData: usersDataReducer,
  router: routerReducer,
  home: homeReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [
  initStateFromLocalStorage
];

if (!environment.production) {
  if (!environment.test) {
    metaReducers.unshift(debug);
  }
}

export const selectAuthState = createFeatureSelector<AppState, AuthState>(
  ('auth')
);

export const selectSiteState = createFeatureSelector<AppState, SiteState>(
  ('site')
);

export const selectSettingsState = createFeatureSelector<
  AppState,
  SettingsState
>('settings');

export const selectRouterState = createFeatureSelector<
  AppState,
  RouterReducerState<RouterStateUrl>
>('router');

export const selectProfileState = createFeatureSelector<
  AppState, 
  ProfileState
>('profile');

export const selectBusinessState = createFeatureSelector<
  AppState,
  BusinessState
>('business');

export const selectUsersDataState = createFeatureSelector<
  AppState,
  UsersDataState
>('usersData');

export const selectFormsState = createFeatureSelector<
  AppState,
  FormsState
>('forms');

export const selectHomeState = createFeatureSelector<
  AppState,
  HomeState
>('home')

export interface AppState {
  auth: AuthState;
  site: SiteState;
  settings: SettingsState;
  profile: ProfileState;
  business: BusinessState;
  usersData: UsersDataState;
  forms: FormsState;
  router: RouterReducerState<RouterStateUrl>;
  home: HomeState;
}

