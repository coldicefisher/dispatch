import { createAction, props } from '@ngrx/store';
import { CreateApplicationFormField } from './state';

export enum FormsActionTypes {
  ProcessCreateBusinessForm1 = '[Forms] ProcessCreateBusinessForm1',
  ProcessCreateBusinessForm2 = '[Forms] ProcessCreateBusinessForm2',
  ProcessCreateBusinessForm3 = '[Forms] ProcessCreateBusinessForm3',
  ProcessCreateBusinessForm4 = '[Forms] ProcessCreateBusinessForm4',
  CreateBusinessFormNavigatePrevious = '[Forms] CreateBusinessFormNavigatePrevious',
  CreateBusinessFormCancel = '[Forms] CreateBusinessFormCancel',
  SignBusinessSignupDisclaimer = '[Forms] SendBusinessSignupDisclaimer',

  SignDocument = '[Forms] SignDocument',
  SignedDocumentSuccess = '[Forms] DocumentSignedSuccess',
  SignedDocumentInvalid = '[Forms] DocumentSignedInvalid',
  SignedDocumentExists = '[Forms] DocumentSignedDocumentExists',
  SignedDocumentFailure = '[Forms] DocumentSignedFailure',

  SearchProfilesByName = '[Forms] SearchProfilesByName',
  UpdateSearchProfilesByNameResults = '[Forms] UpdateSearchProfilesByNameResults',

  CheckEmail = '[Forms] CheckEmail',
  CheckEmailUpdateResults = '[Forms] CheckEmailUpdateResults',

  CheckUsername = '[Forms] CheckUsername',
  CheckUsernameUpdateResults = '[Forms] CheckUsernameUpdateResults',
  
  ProcessCreateApplicationForm1 = '[Forms] ProcessCreateApplicationForm1',
  ProcessCreateApplicationForm2 = '[Forms] ProcessCreateApplicationForm2',
  ProcessCreateApplicationForm3 = '[Forms] ProcessCreateApplicationForm3',
  ProcessCreateApplicationForm4 = '[Forms] ProcessCreateApplicationForm4',
  ProcessCreateApplicationForm5 = '[Forms] ProcessCreateApplicationForm5',
  CommitCreateApplicationForm = '[Forms] CommitCreateApplication',
  ResetCreateApplication = '[Forms] ResetCreateApplication',
  CreateApplicationFormNavigatePrevious = '[Forms] CreateApplicationFormNavigatePrevious',
  AddDemographicsFieldToCreateApplicationForm = '[Forms] AddDemographicsFieldToCreateApplicationForm',
  AddDemographicsFieldValueToCreateApplicationForm = '[Forms] AddDemographicsFieldToCreateApplicationForm',
  RemoveDemographicsFieldFromCreateApplicationForm = '[Forms] RemoveDemographicsFieldFromCreateApplicationForm',
  RemoveDemographicsFieldValueFromCreateApplicationForm = '[Forms] RemoveDemographicsFieldValueFromCreateApplicationForm',
  IncludeDrivingHistoryForCreateApplicationForm = '[Forms] IncludeDrivingHistoryForCreateApplicationForm',
  IncludeAccidentHistoryForCreateApplicationForm = '[Forms] IncludeAccidentHistoryForCreateApplicationForm',
  IncludeEquipmentExperienceForCreateApplicationForm = '[Forms] IncludeEquipmentExperienceForCreateApplicationForm',
  AddEquipmentTypeToCreateApplication = '[Forms] AddEquipmentTypeToCreateApplication',
  RemoveEquipmentTypeFromCreateApplication = '[Forms] RemoveEquipmentTypeFromCreateApplication',
}

// Application ///////////////////////////////////////////////////////////////////////////
export const actionRemoveEquipmentTypeFromCreateApplication = createAction(
    FormsActionTypes.RemoveEquipmentTypeFromCreateApplication,
    props<{ equipmentType: string }>()
);

export const actionAddEquipmentTypeToCreateApplication = createAction(
  FormsActionTypes.AddEquipmentTypeToCreateApplication,
  props<{ equipmentType: string }>()
);

export const actionIncludeDrivingHistoryForCreateApplicationForm = createAction(
  FormsActionTypes.IncludeDrivingHistoryForCreateApplicationForm,
  props<{ include: boolean }>()
);

export const actionIncludeAccidentHistoryForCreateApplicationForm = createAction(
  FormsActionTypes.IncludeAccidentHistoryForCreateApplicationForm,
  props<{ include: boolean }>()
);

export const actionIncludeEquipmentExperienceForCreateApplicationForm = createAction(
  FormsActionTypes.IncludeEquipmentExperienceForCreateApplicationForm,
  props<{ include: boolean }>()
);

export const actionAddDemographicsFieldToCreateApplicationForm = createAction(
  FormsActionTypes.AddDemographicsFieldToCreateApplicationForm,
  props<{ fieldName: string, fieldType: string }>()
);

export const actionRemoveDemographicsFieldFromCreateApplicationForm = createAction(
  FormsActionTypes.RemoveDemographicsFieldFromCreateApplicationForm,
  props<{ fieldName: string }>()
);

export const actionAddDemographicsFieldValueToCreateApplicationForm = createAction(
  FormsActionTypes.AddDemographicsFieldValueToCreateApplicationForm,
  props<{ fieldName: string, fieldValue: string }>()
);

export const actionRemoveDemographicsFieldValueFromCreateApplicationForm = createAction(
  FormsActionTypes.RemoveDemographicsFieldValueFromCreateApplicationForm,
  props<{ fieldName: string, fieldValue: string }>()
);

export const actionProcessCreateApplicationForm1 = createAction(
  FormsActionTypes.ProcessCreateApplicationForm1,
  props<{ name: string, page: number, previousPage: number, visibility: string, description: string }>()
);

export const actionProcessCreateApplicationForm2 = createAction(
  FormsActionTypes.ProcessCreateApplicationForm2,
  props<{ 
    demographicsFields: CreateApplicationFormField[], 
    page: number, 
    previousPage: number, 
    demographicsDisclaimer: string 
  }>()
);

export const actionProcessCreateApplicationForm3 = createAction(
  FormsActionTypes.ProcessCreateApplicationForm3,
  props<{ 
    page: number, 
    previousPage: number, 
    // workHistoryLookback: number, 
    // workHistoryAllowGaps: boolean, 
    // workHistoryDisclaimer: string,
    addressHistoryLookback: number, 
    addressHistoryAllowGaps: boolean,
    addressHistoryDisclaimer: string,
    educationHistoryInclude: boolean,
    employmentHistoryAllowGaps: boolean,
    employmentHistoryLookback: number,
    employmentHistoryDisclaimer: string,
  }>()
);

export const actionProcessCreateApplicationForm4 = createAction(
  FormsActionTypes.ProcessCreateApplicationForm4,
  props<{ 
    page: number, 
    previousPage: number,
    licenseHistoryLookback: number,
    licenseHistoryDisclaimer: string,
    accidentHistoryLookback: number,
    accidentHistoryDisclaimer: string,
  }>()
);

export const actionProcessCreateApplicationForm5 = createAction(
  FormsActionTypes.ProcessCreateApplicationForm5,
  props<{ page: number, previousPage: number, applicationDisclaimer: string }>()
);

export const actionCommitCreateApplicationForm = createAction(
  FormsActionTypes.CommitCreateApplicationForm
);

export const actionResetCreateApplication = createAction(
  FormsActionTypes.ResetCreateApplication,
  
);

export const actionCreateApplicationFormNavigatePrevious = createAction(
  FormsActionTypes.CreateApplicationFormNavigatePrevious,
)
// Business //////////////////////////////////////////////////////////////////////////////


export const actionProcessCreateBusinessForm1 = createAction(
  FormsActionTypes.ProcessCreateBusinessForm1,
  props<{ name: string, legalStructure: string, industry: string, industryCategory: string, page: number, previousPage: number }>()
);


export const actionProcessCreateBusinessForm2 = createAction(
  FormsActionTypes.ProcessCreateBusinessForm2,
  props<{ dotNumber: string, mcNumber: string, page: number, previousPage: number, industry: string }>()
  //props<{ address1: string, address2: string, city: string, state: string, zip: string, page: number, previousPage: number }>()
);

export const actionProcessCreateBusinessForm3 = createAction(
FormsActionTypes.ProcessCreateBusinessForm3,
props<{ address1: string, address2: string, city: string, state: string, zip: string, page: number, previousPage: number, skipMailing: boolean }>()
);

export const actionProcessCreateBusinessForm4 = createAction(
FormsActionTypes.ProcessCreateBusinessForm4,
props<{ address1: string, address2: string, city: string, state: string, zip: string, page: number, previousPage: number }>()
);

export const actionCreateBusinessFormNavigatePrevious = createAction(
FormsActionTypes.CreateBusinessFormNavigatePrevious
)
// export const actionNavigateToProfilePage = createAction(
//     ProfileActionTypes.NavigateToProfilePage,
// );

export const actionSignDocument = createAction(
  FormsActionTypes.SignDocument,
  props<{ showBranding: boolean, profileId: string, templateName: string, allowDuplicates: boolean }>()
);

export const actionSignedDocumentSuccess = createAction(
  FormsActionTypes.SignedDocumentSuccess,
  props<{ templateName: string }>()
);

export const actionSignedDocumentInvalid = createAction(
  FormsActionTypes.SignedDocumentInvalid,
  props<{ templateName: string }>()
);

export const actionSignedDocumentExists = createAction(
  FormsActionTypes.SignedDocumentExists,
  props<{ templateName: string }>()
);

export const actionSignedDocumentFailure = createAction(
  FormsActionTypes.SignedDocumentFailure,
  props<{ templateName: string }>()
);

export const actionSignBusinessSignupDisclaimer = createAction(
  FormsActionTypes.SignBusinessSignupDisclaimer,
  props<{ showBranding: boolean, profileId: string, templateName: string }>()
);

export const actionSearchProfilesByName = createAction(
  FormsActionTypes.SearchProfilesByName,
  props<{ searchString: string, searchType: string }>()
);

export const actionUpdateSearchProfilesByNameResults = createAction(
  FormsActionTypes.UpdateSearchProfilesByNameResults,
  props<{ searchResults: [] }>()
);

export const actionCheckEmail = createAction(
  FormsActionTypes.CheckEmail,
  props<{ email: string }>()
);

export const actionCheckEmailUpdateResults = createAction(
  FormsActionTypes.CheckEmailUpdateResults,
  props<{ isValid: boolean }>()
);

export const actionCheckUsername = createAction(
  FormsActionTypes.CheckUsername,
  props<{ username: string }>()
);

export const actionCheckUsernameUpdateResults = createAction(
  FormsActionTypes.CheckUsernameUpdateResults,
  props<{ isValid: boolean }>()
);

