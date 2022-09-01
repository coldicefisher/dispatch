import { createAction, props } from '@ngrx/store';
import { AuthActionTypes } from '../../auth/auth/actions';

export enum SiteActionTypes {
    AppFailure = '[Site] AppFailure',
    IsLoading = '[Site] IsLoading',
    IsNotLoading = '[Site] IsNotLoading',
    ConnectSocket = '[Site] ConnectSocket'
}
export const actionIsLoading = createAction(
    
        SiteActionTypes.IsLoading,
);
export const actionIsNotLoading = createAction(
    SiteActionTypes.IsNotLoading,
);
export const actionAppFailure = createAction(
    SiteActionTypes.AppFailure,
    props<{ errorCode: number }>()
);

export const actionConnectSocket = createAction(
    SiteActionTypes.ConnectSocket,
)

