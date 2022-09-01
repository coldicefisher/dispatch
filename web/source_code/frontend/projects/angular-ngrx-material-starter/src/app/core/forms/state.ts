
export interface CreateBusinessForm {
  
  page: number | undefined;
  previousPage: number | undefined;
  name: string | undefined;
  nameValid: boolean | undefined;
  legalStructure: string | undefined;
  industry: string | undefined;
  industryCategory: string | undefined;
  physicalAddress1: string | undefined;
  physicalAddress2: string | undefined;
  physicalCity: string | undefined;
  physicalState: string | undefined;
  physicalZip: string | undefined;
  mailingAddress1: string | undefined;
  mailingAddress2: string | undefined;
  mailingCity: string | undefined;
  mailingState: string | undefined;
  mailingZip: string | undefined;
  mcNumber: string | undefined;
  dotNumber: string | undefined;
}


export interface BusinessDisclaimerDocument {
  documentId: string | undefined;
  isProcessing: boolean | undefined;
};

export interface ProfileSearchResult {
  fullName: string | undefined;
  firstName: string | undefined;
  middleName: string | undefined;
  lastName: string | undefined;
  suffix: string | undefined;
  profileId: string | undefined;
  profilePicture: string | undefined;
}

export interface AddBusinessProfile {
  profileId: string | undefined;
  fullName: string | undefined;
  permissions: [];
}

export interface SmartControls {
  emailValid: boolean | undefined;
  businessNameValid: boolean | undefined;
  // usernameValid: boolean | undefined;
}

export interface CreateApplicationFormField {
  fieldName: string | undefined;
  fieldType: string | undefined;
  fieldValues: string[];
}

export interface CreatePostingForm {
  applicationId: string | undefined;
  applicationName: string | undefined;
  applicationTemplates: ApplicationTemplate[]
}

export const initialCreatePostingFormState: CreatePostingForm = {
  applicationId: undefined,
  applicationName: undefined,
  applicationTemplates: [ ]
}

export interface ApplicationTemplate {
  page: number;
  previousPage: number;
  applicationId: string | undefined;
  applicationName: string | undefined;
  applicationAuthor: string | undefined;
  applicationBusinessId: string | undefined;
  visibility: string | undefined;
  
  demographicsFields: CreateApplicationFormField[];
  description: string | undefined;
  demographicsDisclaimer: string | undefined;
  
  employmentHistoryAllowGaps: boolean | undefined;
  employmentHistoryLookback: number | undefined;
  employmentHistoryDisclaimer: string | undefined;
  
//   workHistoryLookback: number | undefined;
//   workHistoryAllowGaps: boolean | undefined;
//   workHistoryDisclaimer: string | undefined;
  
  addressHistoryLookback: number | undefined;
  addressHistoryAllowGaps: boolean | undefined;
  addressHistoryDisclaimer: string | undefined;
  
  educationHistoryInclude: boolean | undefined;
  
  drivingHistoryInclude: boolean | undefined;
  licenseHistoryLookback: number | undefined;
  licenseHistoryDisclaimer: string | undefined;
  
  accidentHistoryInclude: boolean | undefined;
  accidentHistoryLookback: number | undefined;
  accidentHistoryDisclaimer: string | undefined;
  
  equipmentExperienceInclude: boolean | undefined;
  equipmentTypes: string[];
  
  applicationDisclaimer: string | undefined;

  
  
}

export interface FormsState {
  smartControls: SmartControls,
  createBusinessForm: CreateBusinessForm,
  businessDisclaimerDocument: BusinessDisclaimerDocument,
  profileSearchResults: ProfileSearchResult[],
  profileSearchResultsLoading: boolean | undefined,
  addBusinessProfile: AddBusinessProfile,
  createApplicationForm: ApplicationTemplate,
  createPostingForm: CreatePostingForm
};

export const initialCreateApplicationFormState: ApplicationTemplate = {
  page: 1,
  previousPage: 1,
  applicationId: undefined,
  applicationName: undefined,
  applicationAuthor: undefined,
  applicationBusinessId: undefined,
  visibility: 'Public',
  description: undefined,
  
  demographicsDisclaimer: undefined,
  demographicsFields: [
    {
      fieldName: "First Name",
      fieldType: "Text",
      fieldValues: [ ]
    },
    {
      fieldName: "Middle Name",
      fieldType: "Text",
      fieldValues: [ ]
    },
    {
      fieldName: "Last Name",
      fieldType: "Text",
      fieldValues: [ ]
    },
    {
      fieldName: "Suffix",
      fieldType: "Text",
      fieldValues: [ ]
    }
  ],
    
  addressHistoryLookback: 365,
  addressHistoryAllowGaps: false,
  addressHistoryDisclaimer: undefined,
  
  educationHistoryInclude: true,
  
  employmentHistoryLookback: 365,
  employmentHistoryAllowGaps: false,
  employmentHistoryDisclaimer: undefined,

  drivingHistoryInclude: false,
  licenseHistoryLookback: 365,
  licenseHistoryDisclaimer: undefined,

  accidentHistoryInclude: false,
  accidentHistoryLookback: 365,
  accidentHistoryDisclaimer: undefined,
  
  equipmentExperienceInclude: false,
  equipmentTypes: [ ],
  
  applicationDisclaimer: undefined,
  
  
};

export const initialState: FormsState = {
  smartControls: {
    emailValid: undefined,
    businessNameValid: undefined,
    
    // usernameValid: undefined,
  },
  
  businessDisclaimerDocument: {
    documentId: undefined,
    isProcessing: false
  },

  createBusinessForm: {
    page: 1,
    previousPage: 1,
    legalStructure: undefined,
    name: undefined,
    nameValid: false, 
    industry: undefined,
    industryCategory: undefined,
    physicalAddress1: undefined,
    physicalAddress2: undefined,
    physicalCity: undefined,
    physicalState: undefined,
    physicalZip: undefined,
    mailingAddress1: undefined,
    mailingAddress2: undefined,
    mailingCity: undefined,
    mailingState: undefined,
    mailingZip: undefined,
    mcNumber: undefined,
    dotNumber: undefined,
  },

  profileSearchResults: [],
  profileSearchResultsLoading: undefined,
  
  addBusinessProfile: undefined,

  createApplicationForm: initialCreateApplicationFormState,

  createPostingForm: initialCreatePostingFormState,
};
