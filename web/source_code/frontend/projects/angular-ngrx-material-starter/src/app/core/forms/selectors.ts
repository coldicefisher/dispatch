import produce from "immer";

import { createSelector } from '@ngrx/store';

import { selectFormsState } from '../core.state';
import { FormsState } from './state';
import { start } from "repl";

export const selectFormsBusiness = createSelector(
  selectFormsState,
  (state: FormsState) => state
);

export const selectCreateBusinessPageStatus = createSelector(
  selectFormsState,
  (state: FormsState) => 
    { 
      if (state.createBusinessForm === undefined) { return 1 }
      
      if (state.createBusinessForm.page === undefined) { return 1 }
      return state.createBusinessForm.page;
    }
);

export const selectCreateBusinessFormIndustryCategory = createSelector(
  selectFormsState,
  (state: FormsState) => state.createBusinessForm.industryCategory
);

export const selectCreateBusinessForm = createSelector(
  selectFormsState,
  (state: FormsState) => state.createBusinessForm
);

export const selectBusinessNameValid = createSelector(
  selectFormsState,
  (state: FormsState) => state.smartControls.businessNameValid
);

export const selectEmailValid = createSelector(
  selectFormsState,
  (state: FormsState) => state.smartControls.emailValid
);

// export const selectUsernameValid = createSelector(
//   selectFormsState,
//   (state: FormsState) => state.smartControls.usernameValid
// );

export const selectProfileSearchResults = createSelector(
  selectFormsState,
  (state: FormsState) => state.profileSearchResults
);

export const selectProfileFilteredSearchResults = (profileIds: string[]) => createSelector(
  selectFormsState,
  (state: FormsState)  => {
      if (!Array.isArray(profileIds)) {return []}
      return state.profileSearchResults.filter(f => !profileIds.includes(f.profileId));
});
  
export const selectProfileSearchResultsLoading = createSelector(
  selectFormsState,
  (state: FormsState) => state.profileSearchResultsLoading
);

export const selectCreateApplication = createSelector(
  selectFormsState,
  (state: FormsState) => state.createApplicationForm
);

export const selectCreateApplicationDemographicsFields = createSelector(
  selectFormsState,
  (state: FormsState) => state.createApplicationForm.demographicsFields
);

export const selectCreateApplicationPageStatus = createSelector(
  selectFormsState,
  (state: FormsState) =>
  { 
    if (state.createBusinessForm === undefined) { return 1 }
    
    if (state.createBusinessForm.page === undefined) { return 1 }
    return state.createApplicationForm.page;
  }
);

export const selectCreatePostingForm = createSelector(
  selectFormsState,
  (state: FormsState) => state.createPostingForm
);

export const selectCreatePostingApplicationId = createSelector(
  selectFormsState,
  (state: FormsState) => state.createPostingForm.applicationId
);