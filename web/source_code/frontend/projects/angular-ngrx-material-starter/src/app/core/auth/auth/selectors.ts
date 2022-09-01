import { createSelector } from '@ngrx/store';

import { selectAuthState } from '../../core.state';
import { AuthState, OtpOption } from './state';

export const selectAuth = createSelector(
  selectAuthState,
  (state: AuthState) => state
);

export const selectAuthIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectOtpOptions = createSelector(
  selectAuthState,
  (state: AuthState) => state.otpOptions
);

export const selectLoginStatus = createSelector(
  selectAuthState,
  (state: AuthState) => state.loginStatus
);

// export const selectOtpOptionById = (id: string) => createSelector(
//   selectAuthState,
//   (state: AuthState, id: string) => {
//     for (let o in state.otpOptions) {
//       if (o.id == id){
//         return o;
//       }
//       return undefined;
//     }
//   }
// );


export const selectUsername = createSelector(
  selectAuthState,
  (state: AuthState) => state.username
);