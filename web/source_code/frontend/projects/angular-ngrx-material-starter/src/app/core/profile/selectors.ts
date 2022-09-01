import produce from "immer";

import { createSelector } from '@ngrx/store';

import { selectBusinessState, selectProfileState } from '../core.state';
import { BusinessState } from "../business/state";
import { ProfileState } from './state';

export const selectProfile = createSelector(
  selectProfileState,
  (state: ProfileState) => state
);

export const selectProfileFullName = createSelector(
  selectProfileState,
  (state: ProfileState) => {
    //return produce(state, draft => {
      let fullName = state.firstName;
      if (state.middleName != '' && state.middleName != undefined) {
        fullName += ` ${state.middleName}`;
      }
      fullName += ` ${state.lastName}`;
      if (state.suffix != '' && state.suffix != undefined) {
        fullName += ` ${state.suffix}`  
      }
      return fullName;
    });

export const selectProfileId = createSelector(
  selectProfileState,
  (state: ProfileState) => state.profileId
);

export const selectWorkHistories = createSelector(
  selectProfileState,
  state => state.workHistories
);

export const selectSortedWorkHistories = createSelector(
  selectWorkHistories,
  state => {
    return produce(state, draft => {
      
      if (state != undefined) {
        draft.sort((a, b) => {
          if (isNaN(Date.parse(b.item.endDate))) return 1;
          if (Date.parse(b.item.endDate) > Date.parse(a.item.endDate)) {return 1}
          if (Date.parse(b.item.endDate) < Date.parse(a.item.endDate)) {return -1}
          return 0;
        });
      }
      else {
        draft = state;
      }
    });
  }
)

export const selectProfileWorkHistory = (id: number) => createSelector(
  selectProfileState,
  (state: ProfileState) => state.workHistories[state.workHistories.findIndex(x => x.id === id)]

)

export const selectProfileAddresses = createSelector(
  selectProfileState,
  (state: ProfileState) => state.addresses
)

export const selectAddressHistory = (id: number) => createSelector(
  selectProfileState,
  (state: ProfileState) => state.addresses[state.addresses.findIndex(x => x.id === id)]

);

export const selectSortedAddressHistories = createSelector(
  selectProfileAddresses,
  state => {
    return produce(state, draft => {
      
      if (state != undefined) {
        draft.sort((a, b) => {
          if (isNaN(Date.parse(b.item.endDate))) return 1;
          if (Date.parse(b.item.endDate) > Date.parse(a.item.endDate)) {return 1}
          if (Date.parse(b.item.endDate) < Date.parse(a.item.endDate)) {return -1}
          return 0;
        });
      }
      else {
        draft = state;
      }
    });
  }
);

export const selectProfileImages = createSelector(
  selectProfileState,
  (state: ProfileState) => state.images
);

export const selectActiveProfileImage = createSelector(
  selectProfileState,
  state => {
    if (state.images != undefined) {
    
      return state.images[state.images.findIndex(x => x.item.imageType === "profileActive")];
    }
    else {
      return undefined;
    }
  }
);

export const selectProfileBusinesses = createSelector(
  selectProfileState,
  (state: ProfileState) => {
    return state.businesses;
  }
);

export const selectHasAdministratorPermission = createSelector(
  selectProfileState, selectBusinessState,
  (profileState: ProfileState, businessState: BusinessState) => {
    // Check for Administrator Role
    if (profileState.permissions === undefined) { return false};
    let adminPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Administrator`)];
    if (adminPerm != null) { return true; };
    // Check for Owner Role
    let ownerPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Owner`)];
    if (ownerPerm != null) { return true; };
    return false;
  }
)

export const selectHasHumanResourcesPermission = createSelector(
  selectProfileState, selectBusinessState,
  (profileState: ProfileState, businessState: BusinessState) => {
    // Check for Administrator Role
    if (profileState.permissions === undefined) { return false};
    let adminPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Administrator`)];
    if (adminPerm != null) { return true; };
    // Check for Owner Role
    let ownerPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Owner`)];
    if (ownerPerm != null) { return true; };
    let hrPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Human Resources`)];
    if (hrPerm != null) { return true; };
    return false;
  }
)

export const selectHasDispatchingPermission = createSelector(
  selectProfileState, selectBusinessState,
  (profileState: ProfileState, businessState: BusinessState) => {
    // Check for Administrator Role
    if (profileState.permissions === undefined) { return false};
    let adminPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Administrator`)];
    if (adminPerm != null) { return true; };
    // Check for Owner Role
    let ownerPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Owner`)];
    if (ownerPerm != null) { return true; };
    let dispatchingPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Dispatching`)];
    if (dispatchingPerm != null) { return true; };
    return false;
  }
)

export const selectHasAssetsPermission = createSelector(
  selectProfileState, selectBusinessState,
  (profileState: ProfileState, businessState: BusinessState) => {
    // Check for Administrator Role
    if (profileState.permissions === undefined) { return false};
    let adminPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Administrator`)];
    if (adminPerm != null) { return true; };
    // Check for Owner Role
    let ownerPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Owner`)];
    if (ownerPerm != null) { return true; };
    let assetsPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Assets`)];
    if (assetsPerm != null) { return true; };
    return false;
  }
)

export const selectHasDriverPermission = createSelector(
  selectProfileState, selectBusinessState,
  (profileState: ProfileState, businessState: BusinessState) => {
    // Check for Administrator Role
    if (profileState.permissions === undefined) { return false};
    let adminPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Administrator`)];
    if (adminPerm != null) { return true; };
    // Check for Owner Role
    let ownerPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Owner`)];
    if (ownerPerm != null) { return true; };
    let driverPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Driver`)];
    if (driverPerm != null) { return true; };
    return false;
  }
)

export const selectHasEmployeePermission = createSelector(
  selectProfileState, selectBusinessState,
  (profileState: ProfileState, businessState: BusinessState) => {
    // Check for Administrator Role
    if (profileState.permissions === undefined) { return false};
    let adminPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Employee`)];
    if (adminPerm != null) { return true; };
    // Check for Owner Role
    let ownerPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Owner`)];
    if (ownerPerm != null) { return true; };
    let driverPerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Driver`)];
    if (driverPerm != null) { return true; };
    let employeePerm = profileState.permissions[profileState.permissions.findIndex(x => x.item.fullPermission == `${businessState.name}.Employee`)];
    if (employeePerm != null) { return true; };
    return false;
  }
)

// export const selectUniqueBusinesses = createSelector(
//   selectProfileState,
//   state => {
//     if (state.permissions != undefined) {
//       const unique = [...new Set(state.permissions.map(permission => permission.item.business))];
//       return unique;
//     }
//     else {
//       return undefined;
//     }
//   }
// )

// export const selectAggregatedBusinessPermissions = createSelector(
//   selectProfileState,
//   state => {
//     if (state.permissions != undefined) {
//       var allBusinesses = [];
//       for (var permission in state.permissions) {

//       }
//     }
//   }
// )
//   state => {
//     return produce(state, draft => {
//       if (state.images != undefined) {
//         console.log('got something');
//         draft = state[state.images.findIndex(x => x.item.imageType === "profileActive")];
//         return draft;
//       }
//       else{
//         console.log('fuck');
//         draft = undefined;
//         return draft;
//       }
      
//   })
// })
  
  //(state: ProfileState) => state.images[0]
  