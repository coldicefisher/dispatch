import produce from "immer";

import { initialState, FormsState, initialCreateApplicationFormState, CreateApplicationFormField } from './state';

import { actionCheckEmailUpdateResults, actionRemoveDemographicsFieldFromCreateApplicationForm, actionRemoveDemographicsFieldValueFromCreateApplicationForm, actionSearchProfilesByName, actionSignBusinessSignupDisclaimer, actionUpdateSearchProfilesByNameResults } from './actions';

import {
  actionProcessCreateBusinessForm1,
  actionProcessCreateBusinessForm2,
  actionProcessCreateBusinessForm3,
  actionProcessCreateBusinessForm4,
  actionCreateBusinessFormNavigatePrevious,

  actionProcessCreateApplicationForm1,
  actionProcessCreateApplicationForm2,
  actionProcessCreateApplicationForm3,
  actionProcessCreateApplicationForm4,
  actionProcessCreateApplicationForm5,
  actionAddDemographicsFieldToCreateApplicationForm,
  actionAddDemographicsFieldValueToCreateApplicationForm,
  actionResetCreateApplication,
  actionCreateApplicationFormNavigatePrevious,
  actionIncludeDrivingHistoryForCreateApplicationForm,
  actionIncludeAccidentHistoryForCreateApplicationForm,
  actionIncludeEquipmentExperienceForCreateApplicationForm,
  actionAddEquipmentTypeToCreateApplication,
  actionRemoveEquipmentTypeFromCreateApplication,
  
} from './actions';

import * as BusinessActions from '../business/actions';

import { Action, createReducer, on } from '@ngrx/store';

const reducer = createReducer(
  initialState,

  // Process Create Application Form //////////////////////////////////////////////////////////////////
  on(actionRemoveEquipmentTypeFromCreateApplication, (state, action) => {
    return produce(state, draftState => {
      let index = draftState.createApplicationForm.equipmentTypes.findIndex(x => x == action.equipmentType);
      if (index > -1) {
        draftState.createApplicationForm.equipmentTypes.splice(index, 1);
      };
    });
  }),

  on(actionAddEquipmentTypeToCreateApplication, (state, action) => {
    return produce(state, draftState => {
      if (action.equipmentType == '' || action.equipmentType == undefined) { return };
      let index = draftState.createApplicationForm.equipmentTypes.findIndex(x => x == action.equipmentType);
      if (index == -1){
        draftState.createApplicationForm.equipmentTypes.push(action.equipmentType);
      }
    })
  }),

  on(actionIncludeDrivingHistoryForCreateApplicationForm, (state, action) => {
    return produce(state, draftState => {
      draftState.createApplicationForm.drivingHistoryInclude = action.include
    })
  }),

  on(actionIncludeAccidentHistoryForCreateApplicationForm, (state, action) => {
    return produce(state, draftState => {
      draftState.createApplicationForm.accidentHistoryInclude = action.include
    })
  }),

  on(actionIncludeEquipmentExperienceForCreateApplicationForm, (state, action) => {
    return produce(state, draftState => {
      draftState.createApplicationForm.equipmentExperienceInclude = action.include;
    })
  }),

  on(actionAddDemographicsFieldToCreateApplicationForm, (state, action) => {
    return produce(state, draftState => {
      if (action.fieldName != '' && action.fieldName != undefined && action.fieldType != '' && action.fieldType != undefined) {
        let index = draftState.createApplicationForm.demographicsFields.findIndex(x => x.fieldName == action.fieldName);
        if (index == -1){
          let payload: CreateApplicationFormField = {
            fieldName: action.fieldName,
            fieldType: action.fieldType,
            fieldValues: [ ]
          };
          
          draftState.createApplicationForm.demographicsFields.push(payload);
        };  
      };
    });
  }),
  
  on(actionRemoveDemographicsFieldFromCreateApplicationForm, (state, action) => {
    return produce(state, draftState => {
      let index = draftState.createApplicationForm.demographicsFields.findIndex(x => x.fieldName == action.fieldName);
      if (index > -1) { 
        draftState.createApplicationForm.demographicsFields.splice(index, 1);
      }
    })
  }),

  on(actionAddDemographicsFieldValueToCreateApplicationForm, (state, action) => {
    return produce(state, draftState => {
      if (action.fieldName != '' && action.fieldName != undefined && action.fieldValue != '' && action.fieldValue != undefined) {
        let index = draftState.createApplicationForm.demographicsFields.findIndex(x => x.fieldName === action.fieldName);
        if (index > -1) {
          let index2 = draftState.createApplicationForm.demographicsFields[index].fieldValues.findIndex(x => x == action.fieldValue);
          if (index2 == -1) {
            draftState.createApplicationForm.demographicsFields[index].fieldValues.push(action.fieldValue);
          }
        }
      }
    })
  }),
  
  on(actionRemoveDemographicsFieldValueFromCreateApplicationForm, (state, action) => {
    return produce(state, draftState => {
      let indexName = draftState.createApplicationForm.demographicsFields.findIndex(x => x.fieldName == action.fieldName);
      if (indexName > -1) {
        let indexValue = draftState.createApplicationForm.demographicsFields[indexName].fieldValues.findIndex(x => x == action.fieldValue);
        if (indexValue > -1) {
          draftState.createApplicationForm.demographicsFields[indexName].fieldValues.splice(indexValue, 1);
        }
      }
    })
  }),

  on(actionResetCreateApplication, (state, action) => {
    return produce(state, draftState => {
      draftState.createApplicationForm = initialCreateApplicationFormState;
    })  
  }),

  on(actionProcessCreateApplicationForm1, (state, action) => {
    return produce(state, draftState => {
      draftState.createApplicationForm.page = action.page;
      draftState.createApplicationForm.previousPage = action.previousPage;
      draftState.createApplicationForm.applicationName = action.name;
      draftState.createApplicationForm.description = action.description;
      draftState.createApplicationForm.visibility = action.visibility;
    })
  }),

  on(actionProcessCreateApplicationForm2, (state, action) => {
    return produce(state, draftState => {
      draftState.createApplicationForm.demographicsFields = action.demographicsFields;
      draftState.createApplicationForm.page = action.page;
      draftState.createApplicationForm.previousPage = action.previousPage;
      draftState.createApplicationForm.demographicsDisclaimer = action.demographicsDisclaimer;
    })
  }),

  on(actionProcessCreateApplicationForm3, (state, action) => {
    return produce(state, draftState => {
      draftState.createApplicationForm.employmentHistoryLookback = action.employmentHistoryLookback;
      draftState.createApplicationForm.employmentHistoryAllowGaps = action.employmentHistoryAllowGaps;
      draftState.createApplicationForm.employmentHistoryDisclaimer = action.employmentHistoryDisclaimer;
      draftState.createApplicationForm.addressHistoryAllowGaps = action.addressHistoryAllowGaps;
      draftState.createApplicationForm.addressHistoryLookback = action.addressHistoryLookback;
      draftState.createApplicationForm.addressHistoryDisclaimer = action.addressHistoryDisclaimer;
    //   draftState.createApplicationForm.workHistoryAllowGaps = action.workHistoryAllowGaps;
    //   draftState.createApplicationForm.workHistoryLookback = action.workHistoryLookback;
    //   draftState.createApplicationForm.workHistoryDisclaimer = action.workHistoryDisclaimer
      draftState.createApplicationForm.educationHistoryInclude = action.educationHistoryInclude;
      draftState.createApplicationForm.page = action.page;
      draftState.createApplicationForm.previousPage = action.previousPage;
    })
  }),

  on(actionProcessCreateApplicationForm4, (state, action) => {
    return produce(state, draftState => {
      draftState.createApplicationForm.page = action.page;
      draftState.createApplicationForm.previousPage = action.previousPage;
      draftState.createApplicationForm.licenseHistoryDisclaimer = action.licenseHistoryDisclaimer;
      draftState.createApplicationForm.licenseHistoryLookback = action.licenseHistoryLookback;
      draftState.createApplicationForm.accidentHistoryLookback = action.licenseHistoryLookback;
      draftState.createApplicationForm.accidentHistoryDisclaimer = action.accidentHistoryDisclaimer;

    })
  }),

  on(actionProcessCreateApplicationForm5, (state, action) => {
    return produce(state, draftState => {
      draftState.createApplicationForm.page = action.page;
      draftState.createApplicationForm.previousPage = action.previousPage;
      draftState.createApplicationForm.applicationDisclaimer = action.applicationDisclaimer;
    })
  }),

  on(actionCreateApplicationFormNavigatePrevious, (state, action) => {
    return produce(state, draftState => {
      draftState.createApplicationForm.page = state.createApplicationForm.previousPage,
      draftState.createApplicationForm.previousPage = state.createApplicationForm.previousPage - 1
    })
  }),

  // Process Create Business Form /////////////////////////////////////////////////////////////////////
  on(actionProcessCreateBusinessForm1, (state, action) => {
    return produce(state, draftState => {
        draftState.createBusinessForm.name = action.name;
        draftState.createBusinessForm.previousPage = action.previousPage;
        draftState.createBusinessForm.page = action.page;
        draftState.createBusinessForm.legalStructure = action.legalStructure;
        draftState.createBusinessForm.industry = action.industry;
        draftState.createBusinessForm.industryCategory = action.industryCategory;
        draftState.createBusinessForm.dotNumber = undefined;
        draftState.createBusinessForm.mcNumber = undefined;
      })
    
  }),


  on(actionProcessCreateBusinessForm2, (state, action) => {
    return produce(state, draftState => {
        draftState.createBusinessForm.page = action.page,
        draftState.createBusinessForm.previousPage = action.previousPage,
        draftState.createBusinessForm.dotNumber = action.dotNumber,
        draftState.createBusinessForm.mcNumber = action.mcNumber,
        draftState.createBusinessForm.industry = action.industry
      })
  }),

  on(actionProcessCreateBusinessForm3, (state, action) => {
    return produce(state, draftState => {
      
        draftState.createBusinessForm.previousPage = action.previousPage;
        draftState.createBusinessForm.page = action.page;
        draftState.createBusinessForm.physicalAddress1 = action.address1,
        draftState.createBusinessForm.physicalAddress2 = action.address2,
        draftState.createBusinessForm.physicalCity = action.city,
        draftState.createBusinessForm.physicalState = action.state,
        draftState.createBusinessForm.physicalZip = action.zip
        if (action.skipMailing) {
          draftState.createBusinessForm.mailingAddress1 = action.address1,
          draftState.createBusinessForm.mailingAddress2 = action.address2,
          draftState.createBusinessForm.mailingCity = action.city,
          draftState.createBusinessForm.mailingState = action.state,
          draftState.createBusinessForm.mailingZip = action.zip
        }  

      })
  }),

  on(actionProcessCreateBusinessForm4, (state, action) => {
    return produce(state, draftState => {
        draftState.createBusinessForm.previousPage = action.previousPage;
        draftState.createBusinessForm.page = action.page;
        draftState.createBusinessForm.mailingAddress1 = action.address1,
        draftState.createBusinessForm.mailingAddress2 = action.address2,
        draftState.createBusinessForm.mailingCity = action.city,
        draftState.createBusinessForm.mailingState = action.state,
        draftState.createBusinessForm.mailingZip = action.zip
      })
  }),

  on(actionCreateBusinessFormNavigatePrevious, (state, action) => {
    return produce(state, draftState => {
      draftState.createBusinessForm.page = state.createBusinessForm.previousPage,
      draftState.createBusinessForm.previousPage = state.createBusinessForm.previousPage - 1
    })
  }),

  on(actionSignBusinessSignupDisclaimer, (state, action) => {
    return produce(state, draftState => {
      draftState = state;
      draftState.businessDisclaimerDocument.isProcessing = true
    })
  }),

  on(BusinessActions.actionCreateBusinessSuccess, (state) => {
    return produce(state, draftState => {
      draftState.createBusinessForm.page = 1,
      draftState.createBusinessForm.previousPage = 1,
      draftState.createBusinessForm.name = undefined,
      draftState.createBusinessForm.legalStructure = undefined,
      draftState.createBusinessForm.industry = undefined,
      draftState.createBusinessForm.industryCategory = undefined,
      draftState.createBusinessForm.dotNumber = undefined,
      draftState.createBusinessForm.mcNumber = undefined,
      draftState.createBusinessForm.physicalAddress1 = undefined,
      draftState.createBusinessForm.physicalAddress2 = undefined,
      draftState.createBusinessForm.physicalCity = undefined,
      draftState.createBusinessForm.physicalState = undefined,
      draftState.createBusinessForm.physicalZip = undefined,
      draftState.createBusinessForm.mailingAddress1 = undefined,
      draftState.createBusinessForm.mailingAddress2 = undefined,
      draftState.createBusinessForm.mailingCity = undefined,
      draftState.createBusinessForm.mailingState = undefined,
      draftState.createBusinessForm.mailingZip = undefined

    })
  }),
  on(BusinessActions.actionCreateBusinessFailure, (state) => {
    return produce(state, draftState => {
      draftState.createBusinessForm.page = 1,
      draftState.createBusinessForm.previousPage = 1,
      draftState.createBusinessForm.name = undefined,
      draftState.createBusinessForm.legalStructure = undefined,
      draftState.createBusinessForm.industry = undefined,
      draftState.createBusinessForm.industryCategory = undefined,
      draftState.createBusinessForm.dotNumber = undefined,
      draftState.createBusinessForm.mcNumber = undefined,
      draftState.createBusinessForm.physicalAddress1 = undefined,
      draftState.createBusinessForm.physicalAddress2 = undefined,
      draftState.createBusinessForm.physicalCity = undefined,
      draftState.createBusinessForm.physicalState = undefined,
      draftState.createBusinessForm.physicalZip = undefined,
      draftState.createBusinessForm.mailingAddress1 = undefined,
      draftState.createBusinessForm.mailingAddress2 = undefined,
      draftState.createBusinessForm.mailingCity = undefined,
      draftState.createBusinessForm.mailingState = undefined,
      draftState.createBusinessForm.mailingZip = undefined

    })
  }),
  on(BusinessActions.actionCheckBusinessName, (state, action) => {
    return produce(state, draftState => {
      draftState.createBusinessForm.name = action.name
    })
  }),
  on(BusinessActions.actionCheckBusinessNameUpdateResults, (state, action) => {
    
    return produce(state, draftState => {
      
      draftState.smartControls.businessNameValid = action.isValid;
    })
  }),

  on(actionSearchProfilesByName, (state, action) => ({
    ...state,
    profileSearchResultsLoading: true,
  
  })),

  on(actionUpdateSearchProfilesByNameResults, (state, action) => {
    return produce(state, draftState => {
      draftState.profileSearchResults = action.searchResults;
      draftState.profileSearchResultsLoading = false;
    })
  }),

  on(actionCheckEmailUpdateResults, (state, action) => {
    return produce(state, draftState => {
      draftState.smartControls.emailValid = action.isValid;
    })
  })
);




export function formsReducer(
    state: FormsState | undefined,
    action: Action
) {
    return reducer(state, action);
    
}
