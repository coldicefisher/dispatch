import { createAction, props } from '@ngrx/store';
import { profileAddressState, profileImageState } from '../profile/state';
import { 
    BusinessState,
} from './state';

export enum BusinessActionTypes {
    NavigateFromProfileToDashboard = '[Business] NavigateFromProfileToDashboard',   
    NavigateDashboard = '[Business] NavigateDashboard',
    NavigateToCreateBusiness = '[Business] NavigateToCreateBusiness',
    CreateBusiness = '[Business] CreateBusiness',
    CreateBusinessSuccess = '[Business] CreateBusinessSuccess',
    CreateBusinessFailure = '[Business] CreateBusinessFailure',
    CheckBusinessName = '[Business] CheckBusinessName',
    CheckBusinessNameUpdateResults = '[Business] CheckBusinessNameUpdateResults',
    
    GetBusinessData = '[Business] GetBusinessData',
    UpdateBusinessData = '[Business] UpdateBusinessData',
    
    GetBusinessProfile = '[Business] GetBusinessProfile',
    UpdateBusinessProfile = '[Business] UpdateBusinessProfile',
    UpdateBusinessProfileField = '[Business] UpdateBusinessProfileField',
    GetBusinessUsers = '[Business] GetBusinessUsers',
    UpdateBusinessUsers = '[Business] UpdateBusinessUsers',
    CommitBusinessProfile = '[Business] CommitBusinessProfile',
    CommitBusinessProfileSuccess = '[Business] CommitBusinessProfileSuccess',

    InsertBusinessProfileAddress = '[Business] InsertBusinessProfileAddress',

    // SubscribeToBusiness = '[Business] SubscribeToBusiness',
    AddProfileToBusiness = '[Business] AddProfileToBusiness',
    CreateUnassociatedProfile = '[Business] CreateUnassociatedProfile',
    
    SetAsDefaultBusiness = '[Business] SetAsDefaultBusiness',
    SetAsDefaultBusinessSuccess = '[Business] SetAsDefaultBusinessSuccess',

    ReplaceUserPermissions = '[Business] ReplaceUserPermissions',

    DeleteBusinessProfile = '[Business] DeleteBusinessProfile',


    RECEIVEDReplacedUserPermissionsSuccess = '[Business] RECEIVEDReplaceUserPermissionsSuccess',
    RECEIVEDAddedProfileToBusinessSuccess = '[Business] RECEIVEDAddedProfileToBusinessSuccess',
    RECEIVEDdeletedBusinessProfileSuccess = '[Business] RECEIVEDDeletedBusinessProfileSuccess',

}

// Business //////////////////////////////////////////////////////////////////////////////

export const actionNavigateFromProfileToDashboard = createAction(
    BusinessActionTypes.NavigateFromProfileToDashboard,
    props<{ uid: string, name: string }>()
);

export const actionNavigateDashboard = createAction(
    BusinessActionTypes.NavigateDashboard,
    props<{ route: string }>()
);

export const actionNavigateToCreateBusiness = createAction(
  BusinessActionTypes.NavigateToCreateBusiness,
);

export const actionCreateBusiness = createAction(
    BusinessActionTypes.CreateBusiness,
    props<{ 
        name: string,
        profileId: string,
        industry: string,
        industryCategory: string,
        mcNumber: string,
        dotNumber: string,
        legalStructure: string,
        physicalAddress1: string,
        physicalAddress2: string,
        physicalCity: string,
        physicalState: string,
        physicalZip: string,
        mailingAddress1: string,
        mailingAddress2: string,
        mailingCity: string,
        mailingState: string,
        mailingZip: string,
        
     }>()
);

export const actionCreateBusinessSuccess = createAction(
  BusinessActionTypes.CreateBusinessSuccess,
  props<{ name: string, uid: string }>()
);
export const actionCreateBusinessFailure = createAction(
  BusinessActionTypes.CreateBusinessFailure,
  props<{ name: string }>()
);

export const actionCheckBusinessName = createAction(
  BusinessActionTypes.CheckBusinessName,
  props<{ name: string }>()
);

export const actionCheckBusinessNameUpdateResults = createAction(
  BusinessActionTypes.CheckBusinessNameUpdateResults,
  props<{ isValid: boolean }>()
);

export const actionGetBusinessData = createAction(
  BusinessActionTypes.GetBusinessData,
  props<{ businessName: string }>()
);

export const actionUpdateBusinessData = createAction(
  BusinessActionTypes.UpdateBusinessData,
  props<{ uid: string, businessName: string }>()
);

export const actionGetBusinessUsers = createAction(
  BusinessActionTypes.GetBusinessUsers,
  //props<{ businessName: string}>()
);

export const actionUpdateBusinessUsers = createAction(
  BusinessActionTypes.UpdateBusinessUsers,
  props<{ users: [] }>()
);

export const actionAddProfileToBusiness = createAction(
  BusinessActionTypes.AddProfileToBusiness,
  props<{profileId: string, permissions: string[], firstName: string, middleName: string, lastName: string, suffix: string }>()
);

export const actionCreateUnassociatedProfile = createAction(
  BusinessActionTypes.CreateUnassociatedProfile,
  props<{ firstName: string, middleName: string, lastName: string, suffix: string, permissions: string[], email: string}>()
);

export const actionSetAsDefaultBusiness = createAction(
  BusinessActionTypes.SetAsDefaultBusiness,
  props<{ businessName: string }>()
);

export const actionSetAsDefaultBusinessSuccess = createAction(
  BusinessActionTypes.SetAsDefaultBusinessSuccess,
  props<{ businessName: string }>()
);

export const actionReplaceUserPermissions = createAction(
  BusinessActionTypes.ReplaceUserPermissions,
  props<{ profileId: string, permissions: string[] }>()
);

export const actionDeleteBusinessProfile = createAction(
  BusinessActionTypes.DeleteBusinessProfile,
  props<{ profileId: string, businessName: string, firstName: string, middleName: string, lastName: string, suffix: string }>()
);

export const actionGetBusinessProfile = createAction(
  BusinessActionTypes.GetBusinessProfile,
  props<{ businessName: string }>()
);

export const actionUpdateBusinessProfile = createAction(
  BusinessActionTypes.UpdateBusinessProfile,
  props<{ images: profileImageState[], about: string, addresses: profileAddressState[], dotNumber: string, mcNumber: string }>()
)
export const actionUpdateBusinessProfileField = createAction(
  BusinessActionTypes.UpdateBusinessProfileField,
  props<{ fieldName: string, fieldValue: string }>()
);

export const actionInsertBusinessProfileAddress = createAction(
  BusinessActionTypes.InsertBusinessProfileAddress,
  props<{ addressType: string, address1: string, address2: string, city: string, state: string, zip: string }>()
);

export const actionCommitBusinessProfile = createAction(
  BusinessActionTypes.CommitBusinessProfile,
  //props<{ businessName: string, images: profileImageState[], about: string, addresses: profileAddressState[]; }>()
);

export const actionCommitBusinessProfileSuccess = createAction(
  BusinessActionTypes.CommitBusinessProfileSuccess,
);

// THESE ARE RECEIVED FROM THE SOCKET !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export const actionRECEIVEDReplacedUserPermissionsSuccess = createAction(
  BusinessActionTypes.RECEIVEDReplacedUserPermissionsSuccess,
  props<{ profileId: string, business: string, permissions: string[] }>()
);

export const actionRECEIVEDAddedProfileToBusinessSuccess = createAction(
  BusinessActionTypes.RECEIVEDAddedProfileToBusinessSuccess,
  props<{ profileId: string, business: string, firstName: string, middleName: string, lastName: string, suffix: string }>()
);

export const actionRECEIVEDDeletedBusinessProfileSuccess = createAction(
  BusinessActionTypes.RECEIVEDdeletedBusinessProfileSuccess,
  props<{ profileId: string, business: string, firstName: string, middleName: string, lastName: string, suffix: string }>()
);

// export const actionSubscribeToBusiness = createAction(
//     BusinessActionTypes.SubscribeToBusiness,
  
// );