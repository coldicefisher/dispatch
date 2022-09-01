import produce, { current } from "immer";

import { initialState, BusinessState } from './state';


import {
  actionNavigateFromProfileToDashboard,
  actionNavigateDashboard,
  actionUpdateBusinessUsers,
  actionUpdateBusinessData,
  actionGetBusinessUsers,
  actionUpdateBusinessProfile,
  actionUpdateBusinessProfileField,
  actionInsertBusinessProfileAddress,

  actionReplaceUserPermissions,
  actionRECEIVEDReplacedUserPermissionsSuccess,
  actionRECEIVEDAddedProfileToBusinessSuccess,
  actionAddProfileToBusiness,
  actionCreateUnassociatedProfile,
  actionRECEIVEDDeletedBusinessProfileSuccess,
  actionDeleteBusinessProfile,
} from './actions';

import { actionChangeActiveBusinessProfilePicture } from "../images/actions";
import { actionProcessBusinessProfileImageInfoFromUploadCare } from "../images/actions";

import { actionLogOut, actionLogOutSuccess } from "../auth/auth/actions";

import { Action, createReducer, on } from '@ngrx/store';


const reducer = createReducer(
  initialState,

  on(actionNavigateFromProfileToDashboard, (state, {uid, name}) => ({
      ...state,
      uid: uid,
      name: name,
      currentView: 'dashboard',
      users: [],
    })
  ),

  on(actionNavigateDashboard, (state, action) => ({
        ...state,
        currentView: action.route
    })
  ),
  // UPDATE BUSINESS USERS /////////////////////////////////////////////////////////////////////
  on(actionUpdateBusinessUsers, (state, action) => {
    return produce(state, draftState => {
      const BreakError = {}
      let ids = [];
      // if (!draftState.users) { return } // There are no users
      let usersCopy = Object.assign([], draftState.users);

      // Filter out null users


    
      draftState.users.forEach(user => {
        try {
          if (user === null) {

          }
          // remove duplicates
          if (ids.includes(user.profileId.trim())) {
            // console.log(`Removing duplicate user ${user.firstName} ${user.lastName}...`)
            draftState.users.splice(draftState.users.indexOf(user), 1);
            throw BreakError;
          }
          // Set the duplicate check array
          ids.push(user.profileId.trim());

          // Remove missing items
          let userIndex = action.users.findIndex(x => x['profileId'] === user.profileId);
          if (userIndex < 0) {
            console.log(`Removing user: ${user.firstName} ${user.lastName}`)
            draftState.users.splice(draftState.users.indexOf(user), 1);
          }

        } // End Try 
        catch (err) {
          if (err === BreakError){}
          if (err !== BreakError){throw err}
        }
      })
      
      let user: any;
      action.users.forEach(user => {
        try {
          let stateUsers = Object.assign([], state.users);
          let userIndex = stateUsers.findIndex(x => x.profileId === user['profileId']);
          if (userIndex < 0) {
            draftState.users.push(user); // Add missing user
            throw BreakError;
          }
          let oldUser = Object.assign({}, stateUsers[stateUsers.findIndex(x => x.profileId === user['profileId'])]); // get the current user and compare values
          
          let equals = true;
          let oldPerm = Object.assign([], oldUser.permissions);
          
          // Compare names
          if (oldUser.firstName != user['firstName'] || oldUser.middleName != user['middleName'] || oldUser.lastName != user['lastName'] || oldUser.suffix != user['suffix']) { 
            equals = false; };
          // Compare other attributes
          if (oldUser.deleted != user['deleted'] || oldUser.hasLogin != user['hasLogin'] || oldUser.profilePicture != user['profilePicture']) { equals = false; };
          // Compare permissions
          let newPerm: string[] = Object.assign([], user['permissions']);
          if (JSON.stringify(oldPerm.sort()) != JSON.stringify(newPerm.sort())) { equals = false; };
          if (equals === false) {
            draftState.users.splice(draftState.users.findIndex(x => x.profileId === user['profileId']), 1, user);
          }
      
        } catch (err) {
          if (err === BreakError){}
          if (err !== BreakError){throw err}
        }
      }) // End action users loop
    })
  }),
  // UPDATE BUSINESS USERS /////////////////////////////////////////////////////////////////////

  // Permissions Changed ///////////////////////////////////////////////////////////////////////
  on(actionReplaceUserPermissions, (state, action) => {
    return produce(state, draftState => {
      if (!draftState.users) { return };
      try {
        draftState.users[draftState.users.findIndex(x => x.profileId === action.profileId)].permissions = action.permissions;
        draftState.users[draftState.users.findIndex(x => x.profileId === action.profileId)].pending = true;
      } catch{ }
      
    })
  }),

  // Add users /////////////////////////////////////////////////////////////////////////////////
  on(actionAddProfileToBusiness, (state, action) => {
    return produce(state, draftState => {
      if (!draftState.users) {return};
      draftState.pendingUsers.push({
        firstName: action.firstName,
        middleName: action.middleName,
        lastName: action.lastName,
        suffix: action.suffix,
        permissions: action.permissions,
        profileId: action.profileId,
        pending: true,
        profilePicture: undefined,
        hasLogin: undefined,
        deleted: undefined,
        associationEmail: undefined,

      })
    })
  }),
  
  on(actionDeleteBusinessProfile, (state, action) => {
    return produce(state, draftState => {
      if (!draftState.users) { return };
      draftState.deletingUsers.push({
        firstName: action.firstName,
        middleName: action.middleName,
        lastName: action.lastName,
        suffix: action.suffix,
        permissions: [],
        profileId: action.profileId,
        pending: true,
        profilePicture: undefined,
        hasLogin: undefined,
        deleted: undefined,
        associationEmail: undefined
      })
      draftState.users.splice(draftState.users.findIndex(x => x.profileId === action.profileId), 1);
    })
  }),
  
  on(actionCreateUnassociatedProfile, (state, action) => {
    return produce(state, draftState => {
      if (!draftState.users) {return};
      draftState.pendingUsers.push({
        firstName: action.firstName,
        middleName: action.middleName,
        lastName: action.lastName,
        suffix: action.suffix,
        permissions: action.permissions,
        profileId: undefined,
        pending: true,
        profilePicture: undefined,
        hasLogin: undefined,
        deleted: undefined,
        associationEmail: action.email

      })
    })
  }),
  
  on(actionLogOutSuccess, (state) => ({
    ...state,
    name: undefined,
    uid: undefined,
    currentView: undefined,
    users: [],
  })),

  on(actionUpdateBusinessData, (state, action) => {
    return produce(state, draftState => {
      draftState.uid = action.uid;
      draftState.name = action.businessName;
    })
  }),

  on(actionGetBusinessUsers, (state, action) => {
    return produce(state, draftState => {
      draftState.isLoadingUsers = true;
    })
  }),

  on(actionUpdateBusinessUsers, (state, action) => {
    return produce(state, draftState => {
      draftState.isLoadingUsers = false;
    })
  }),

  on(actionUpdateBusinessProfile, (state, action) => {
    return produce(state, draftState => {
      draftState.businessProfile.images = action.images;
      draftState.businessProfile.about = action.about;
      draftState.businessProfile.addresses = action.addresses;
      draftState.businessProfile.mcNumber = action.mcNumber;
      draftState.businessProfile.dotNumber = action.dotNumber;
      
    })
  }),

  on(actionUpdateBusinessProfileField, (state, {fieldName, fieldValue}) => {
    return produce(state, draftState => {
      draftState.businessProfile[fieldName] = fieldValue;
    })
  }),


  on(actionChangeActiveBusinessProfilePicture, (state, action) => {
    return produce(state, draftState => {
        draftState.businessProfile.images[state.businessProfile.images.findIndex(x => x.item.imageType === "profileActive")].item.imageType = 'profile';
        draftState.businessProfile.images[state.businessProfile.images.findIndex(x => x.item.uuid === action.uuid)].item.imageType = 'profileActive';
        return draftState;
        
    })
  }),

  on(actionProcessBusinessProfileImageInfoFromUploadCare, (state, action) => {
    const ids = state.businessProfile.images.map(object => {
        return object.id;
      });
      let myId = 0;
      if (ids.length > 0) {
        const maxId = Math.max(...ids);
        myId = maxId + 1;
      }

    return produce(state, draftState => {
        
        draftState.businessProfile.images.push({ id: myId, item: {id: myId, imageType: action.imageType, uuid: action.uuid, originalUrl: action.originalUrl, cdnUrl: action.cdnUrl, name: action.name, mimeType: action.mimeType, size: action.size }});
    })
  }),

  on(actionInsertBusinessProfileAddress, (state, action) => {
    return produce(state, draftState => {
      const ids = state.businessProfile.addresses.map(object => {
        return object.id;
      });
      let myId = 0;
      if (ids.length > 0) {
        const maxId = Math.max(...ids);
        myId = maxId + 1;
      }
      const now = new Date();

      // Set the old addresses date to today
      draftState.businessProfile.addresses.forEach(address => {
        if (address.item.addressType == action.addressType) {
          if (address.item.endDate == null || address.item.endDate == undefined || address.item.endDate == '') {
            address.item.endDate = now.toLocaleDateString();
          }

        }
      });

      // Add the new date
      draftState.businessProfile.addresses.push({
        id: myId,
        item: {
          id: myId,
          startDate: now.toLocaleDateString(),
          endDate: null,
          addressType: action.addressType,
          address1: action.address1,
          address2: action.address2,
          city: action.city,
          state: action.state,
          zip: action.zip,
        }
      })
    })
  }),

  // RECEIVED  //////////////////////////////////////////////////////////////////////////////////////
  on(actionRECEIVEDReplacedUserPermissionsSuccess, (state, action) => {
    return produce(state, draftState => {
      if (!draftState.users) { return };
      try {
        draftState.users[draftState.users.findIndex(x => x.profileId === action.profileId)].permissions = action.permissions;
        draftState.users[draftState.users.findIndex(x => x.profileId === action.profileId)].pending = false;
      } catch{ }
      
    })
  }),

  on(actionRECEIVEDAddedProfileToBusinessSuccess, (state, action) => {
    return produce(state, draftState => {
      draftState.pendingUsers.splice(draftState.pendingUsers.findIndex(x => x.firstName == action.firstName && x.middleName == action.middleName && x.lastName == action.lastName && x.suffix == action.suffix), 1);
    })
  }),

  on(actionRECEIVEDDeletedBusinessProfileSuccess, (state, action) => {
    return produce(state, draftState => {
      draftState.users.splice(draftState.users.findIndex(x => x.profileId === action.profileId), 1);
      draftState.deletingUsers.splice(draftState.deletingUsers.findIndex(x => x.profileId === action.profileId));
      
    })
  }),
  
  
);

export function businessReducer(
    state: BusinessState | undefined,
    action: Action
) {
    return reducer(state, action);
    
}
