import produce from "immer";

import { createSelector } from '@ngrx/store';

import { selectBusinessState } from '../core.state';
import { BusinessState } from './state';

export const selectBusiness = createSelector(
  selectBusinessState,
  (state: BusinessState) => state
);

export const selectCurrentBusinessView = createSelector(
  selectBusinessState,
  (state: BusinessState) => state.currentView
);

export const selectBusinessName = createSelector(
  selectBusinessState,
  (state: BusinessState) => state.name
);

export const selectBusinessUsers = createSelector(
  selectBusinessState,
  (state: BusinessState) => {
    let userArr = [];
    state.users.forEach(user => { if (user){ userArr.push(user) } });
    return userArr;
  }
);

export const selectPendingAddBusinessUsers = createSelector(
  selectBusinessState,
  (state: BusinessState) => {
    let userArr = [];
    state.pendingUsers.forEach(user => {if (user){userArr.push(user) } });
    return userArr;
  }
);

export const selectPendingDeleteBusinessUsers = createSelector(
  selectBusinessState,
  (state: BusinessState) => {
    let userArr = [];
    state.deletingUsers.forEach(user => {if (user) {userArr.push(user) } });
    return userArr;
  }
)
export const selectFilteredBusinessUsers = (filter: string) => createSelector(
    selectBusinessState,
    (state: BusinessState) => {
        let userArr = [];
        state.users.forEach(user => {
            if (user){
                if (filter === 'All') {
                  userArr.push(user);
                }
                else {
                  if (user.permissions.includes(filter)) {
                      userArr.push(user);
                  }
                }
            }
        })
        console.log(userArr);
        return userArr;
    }
)
export const selectBusinessUsersIds = createSelector(
  selectBusinessState,
  state => {
    return state.users.map(item => item.profileId)
  }
);


export const selectBusinessProfileById = (profileId: string) => createSelector(
  selectBusinessState,
  (state: BusinessState) => { return state.users.filter(x => x.profileId === profileId)[0]; }
);


export const selectIsLoadingUsers = createSelector(
  selectBusinessState,
  (state: BusinessState) => state.isLoadingUsers
);


export const selectActiveBusinessProfileImage = createSelector(
  selectBusinessState,
  state => {
    if (state.businessProfile.images != undefined) {
    
      return state.businessProfile.images[state.businessProfile.images.findIndex(x => x.item.imageType === "profileActive")];
    }
    else {
      return undefined;
    }
  }
);

export const selectBusinessProfile = createSelector(
  selectBusinessState,
  (state: BusinessState) => state.businessProfile
);

export const selectBusinessProfileWithCurrentAddresses = createSelector(
    selectBusinessState,
    (state: BusinessState) => {
      let business: {} = {};
      
      business = {
        name: state.name,
        about: state.businessProfile.about,
        activeProfileImage: state.businessProfile.images[state.businessProfile.images.findIndex(x => x.item.imageType === 'profileActive')],
        dotNumber: state.businessProfile.dotNumber,
        mcNumber: state.businessProfile.mcNumber
      }
      let mailAddresses: Object[] = [ ];
      let phyAddresses: Object[] = [ ];
    
      for (let address of state.businessProfile.addresses) {
        
        if (address.item.addressType == 'Physical') { 
          if (address.item.endDate == null || address.item.endDate == '') {phyAddresses.push(address.item) }
        }
        if (address.item.addressType == 'Mailing') {
          if (address.item.endDate == null || address.item.endDate == '') { mailAddresses.push(address.item) }
        }
      }
      business['physicalAddresses'] = phyAddresses;
      business['mailingAddresses'] = mailAddresses;
  
      return business;
    }
  );
  