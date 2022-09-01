import { createAction, props } from '@ngrx/store';
import { 
    profileAddress, 
    profileAddressState, 
    profileBusinessState, 
    profileImageState, 
    profilePermissionsState, 
    profileWorkHistory, 
    profileWorkHistoryState 
} from './state';

export enum ProfileActionTypes {
    NavigateToProfilePage = '[Profile] NavigateToProfilePage',
    RetrieveUserProfile = '[Profile] RetrieveUserProfile',

    GetProfile = '[Profile] GetProfile',
    GetProfileSuccess = '[Profile] UpdateProfileSuccess',
    DeleteProfile = '[Profile] DeleteProfile',
    DeleteProfileSuccess = '[Profile] DeleteProfileSuccess',
    DeleteProfileFailure = '[Profile] DeleteProfileFailure',
    CommitProfile = '[Profile] CommitProfile',
    CommitProfileSuccess = '[Profile] CommitProfileSuccess',
    CommitProfileFailure = '[Profile] CommitProfileFailure',
    
    UpdateProfilePermissions = '[Profile] UpdateProfilePermissions',
    UpdateProfileField = '[Profile] UpdateProfileField',

    UpdateProfileWorkHistory = '[Profile] UpdateProfileWorkHistory',
    UpdateProfileWorkHistoryField = '[Profile] UpdateProfileWorkHistoryField',
    InsertProfileWorkHistory = '[Profile] InsertProfileWorkHistory',
    DeleteProfileWorkHistory = '[Profile] DeleteProfileWorkHistory',

    UpdateProfileAddressHistory = '[Profile] UpdateProfileAddressHistory',
    UpdateProfileAddressHistoryField = '[Profile] UpdateProfileAddressHistoryField',
    InsertProfileAddressHistory = '[Profile] InsertProfileAddressHistory',
    DeleteProfileAddressHistory = '[Profile] DeleteProfileAddressHistory',

    UpdatePassword = '[Profile] UpdatePassword',
    UpdatePasswordSuccess = '[Profile] UpdatePasswordSuccess',
    UpdatePasswordFailure = '[Profile] UpdatePasswordFailure',

    
}

// Profile //////////////////////////////////////////////////////////////////////////////

export const actionNavigateToProfilePage = createAction(
    ProfileActionTypes.NavigateToProfilePage,
);

export const actionGetProfile = createAction(
    ProfileActionTypes.GetProfile,
    // props<{ middleName: string, gender: string, suffix: string, addresses: [], workHistories: [] }>()
);

export const actionGetProfileSuccess = createAction(
    ProfileActionTypes.GetProfileSuccess,
    props<{ firstName: string, middleName: string, lastName: string, profileId: string, gender: string, suffix: string, addresses: profileAddressState[], workHistories: profileWorkHistoryState[], images: profileImageState[], privacyStatus: string, seekingStatus: string, permissions: profilePermissionsState[], businesses: profileBusinessState[], defaultBusiness: string }>()
);

export const actionCommitProfile = createAction(
    ProfileActionTypes.CommitProfile,
    props<{ firstName: string, middleName: string, lastName: string, gender: string, suffix: string, addresses: profileAddress[], workHistories: profileWorkHistory[], images: profileImageState[], privacyStatus: string, seekingStatus: string }>()
);


export const actionCommitProfileSuccess = createAction(
    ProfileActionTypes.CommitProfileSuccess,
);

export const actionCommitProfileFailure = createAction(
    ProfileActionTypes.CommitProfileFailure
);

export const actionDeleteProfile = createAction(
    ProfileActionTypes.DeleteProfile
);

export const actionDeleteProfileSuccess = createAction(
    ProfileActionTypes.DeleteProfileSuccess
);

export const actionDeleteProfileFailure = createAction(
    ProfileActionTypes.DeleteProfileSuccess
)
// export const actionRetrieveUserProfile = createAction(
//     ProfileActionTypes.RetrieveUserProfile,
// );

// End Profile ///////////////////////////////////////////////////////////////////////////

// Profile Work History //////////////////////////////////////////////////////////////////

export const actionUpdateProfileWorkHistory = createAction(
    ProfileActionTypes.UpdateProfileWorkHistory,
    props<{ id: number, history: profileWorkHistory }>()
);

export const actionUpdateProfileWorkHistoryField = createAction(
    ProfileActionTypes.UpdateProfileWorkHistoryField,
    props<{ id: number, fieldName: string, fieldValue: string }>()
);

export const actionInsertProfileWorkHistory = createAction(
    ProfileActionTypes.InsertProfileWorkHistory,
    props<{ businessName: string, startDate: string, endDate: string, positionsHeld: string, description: string, physicalAddress1: string, physicalAddress2: string, physicalCity: string, physicalState: string, physicalZip: string, mailingAddress1: string, mailingAddress2: string, mailingCity: string, mailingState: string, mailingZip: string, supervisor: string, phoneNumber: string, email: string, website: string }>()
);

export const actionDeleteProfileWorkHistory = createAction(
    ProfileActionTypes.DeleteProfileWorkHistory,
    props<{ id: number }>()
);
// END PROFILE WORK HISTORY ///////////////////////////////////////////////////////////////

// PROFILE ADDRESS HISTORY ////////////////////////////////////////////////////////////////
export const actionUpdateProfileAddressHistory = createAction(
    ProfileActionTypes.UpdateProfileAddressHistory,
    props<{ id: number, address: profileAddress }>()
);

export const actionUpdateProfileAddressHistoryField = createAction(
    ProfileActionTypes.UpdateProfileAddressHistoryField,
    props<{ id: number, fieldName: string, fieldValue: string }>()
);

export const actionInsertProfileAddressHistory = createAction(
    ProfileActionTypes.InsertProfileAddressHistory,
    props<{ addressType: string, startDate: string, endDate: string, address1: string, address2: string, city: string, state: string, zip: string  }>()
);

export const actionDeleteProfileAddressHistory = createAction(
    ProfileActionTypes.DeleteProfileAddressHistory,
    props<{ id: number }>()
);

export const actionUpdateProfileField = createAction(
    ProfileActionTypes.UpdateProfileField,
    props<{ fieldName: string, fieldValue: string }>()
);

export const actionUpdatePassword = createAction(
    ProfileActionTypes.UpdatePassword,
    props<{ currentPassword: string, newPassword: string }>()
);

export const actionUpdatePasswordSuccess = createAction(
    ProfileActionTypes.UpdatePasswordSuccess,
);

export const actionUpdatePasswordFailure = createAction(
    ProfileActionTypes.UpdatePasswordFailure,
);

export const actionUpdateProfilePermissions = createAction(
    ProfileActionTypes.UpdateProfilePermissions,
    props<{ permissions: profilePermissionsState[] }>()
);



