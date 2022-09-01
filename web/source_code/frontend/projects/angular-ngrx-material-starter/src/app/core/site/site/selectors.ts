import { createSelector } from '@ngrx/store';

import { selectSiteState } from '../../core.state';
import { SiteState } from './state';

export const selectSite = createSelector(
  selectSiteState,
  (state: SiteState) => state
);

export const selectIsLoading = createSelector(
  selectSiteState,
  (state: SiteState) => state.isLoading
);
