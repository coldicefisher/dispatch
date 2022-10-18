import { createAction, props } from '@ngrx/store';
import { 
    UsersDataState,
} from './state';

import { UserByNameState } from './state';

export enum UsersDataActionTypes {
    GetUsersData = '[UsersData] GetUsersData',
    SaveUsersData = '[UsersData] SaveUsersData'
    

}

// Business //////////////////////////////////////////////////////////////////////////////

export const actionGetUsersData = createAction(
    UsersDataActionTypes.GetUsersData,
);

export const actionSaveUsersData = createAction(
    UsersDataActionTypes.SaveUsersData,
    //props<{ firstName: string, middleName: string, lastName: string, suffix: string, fullName: string, profileId: string}>()
    props<{ usersByName: UserByNameState[]}>()
);
// export const actionNavigateToProfilePage = createAction(
//     ProfileActionTypes.NavigateToProfilePage,
// );
