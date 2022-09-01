import produce from "immer";

import { initialState, ProfileState, profileWorkHistory } from './state';

import {
    actionNavigateToProfilePage,
    //actionRetrieveUserProfile,    
    actionGetProfileSuccess,
    actionUpdateProfileField,
    
    actionUpdateProfileWorkHistory,
    actionUpdateProfileWorkHistoryField,
    actionInsertProfileWorkHistory,
    actionDeleteProfileWorkHistory,

    actionUpdateProfileAddressHistory,
    actionUpdateProfileAddressHistoryField,
    actionInsertProfileAddressHistory,
    actionDeleteProfileAddressHistory,
    actionUpdateProfilePermissions,

    
} from './actions';

import {
    actionLogOutSuccess
} from '../auth/auth/actions';

import {
    actionProcessProfileImageInfoFromUploadCare,
    actionChangeActiveProfilePicture,
    actionRemoveActiveProfilePicture
}
from '../images/actions';

import { Action, createReducer, on } from '@ngrx/store';
import { ProfileRoutingModule } from "../../features/profile/profile-routing.module";

const reducer = createReducer(
    initialState,

    on(actionGetProfileSuccess, (state, { firstName, middleName, lastName, suffix, profileId, gender, addresses, workHistories, images, privacyStatus, seekingStatus, permissions, businesses, defaultBusiness }) => ({ ...state,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        suffix: suffix,
        profileId: profileId,
        gender: gender,
        privacyStatus: privacyStatus,
        seekingStatus: seekingStatus,
        addresses: addresses,
        workHistories: workHistories,
        images: images,
        permissions: permissions,
        businesses: businesses,
        defaultBusiness: defaultBusiness,
        
    })),
    
    on(actionLogOutSuccess, (state) => ({ ...state,
        firstName: undefined,
        middleName: undefined,
        lastName: undefined,
        suffix: undefined,
        gender: undefined,
        privacyStatus: undefined,
        seekingStatus: undefined,
        addresses: undefined,
        workHistories: undefined,
        images: undefined,
        permissions: undefined,
        businesses: undefined,
        profileId: undefined,
        defaultBusiness: undefined,
    })),


    on(actionUpdateProfileField, (state, {fieldName, fieldValue}) => {
        return produce(state, draftState => {
            draftState[fieldName] = fieldValue
    })}),

    on(actionUpdateProfileWorkHistory, (state, {id, history}) => {
        return produce(state, draftState => {
            draftState.workHistories[state.workHistories.findIndex(x => x.id === id)].item = history;
    })}),

    on(actionUpdateProfileWorkHistoryField, (state, {id, fieldName, fieldValue}) => {
        return produce(state, draftState => {
            draftState.workHistories[state.workHistories.findIndex(x => x.id === id)].item[fieldName] = fieldValue;
    })}),


    on(actionInsertProfileWorkHistory, (state, action) => {
      return produce(state, draftState => {  
        const ids = state.workHistories.map(object => {
          return object.id;
        });

        let myId = 0;
        if (ids.length > 0) {
          const maxId = Math.max(...ids);
          myId = maxId + 1;
        }

      
        draftState.workHistories.push({ 
          id: myId, 
          item: {
            id: myId, 
            businessName: action.businessName, 
            positionsHeld: action.positionsHeld, 
            description: action.description, 
            startDate: action.startDate, 
            endDate: action.endDate, 
            physicalAddress1: action.physicalAddress1, 
            physicalAddress2: action.physicalAddress2, 
            physicalCity: action.physicalCity, 
            physicalState: action.physicalState, 
            physicalZip: action.physicalZip, 
            mailingAddress1: action.mailingAddress1, 
            mailingAddress2: action.mailingAddress2, 
            mailingCity: action.mailingCity, 
            mailingState: action.mailingState, 
            mailingZip: action.mailingZip, 
            supervisor: action.supervisor, 
            phoneNumber: action.phoneNumber, 
            email: action.email, 
            website: action.website 
          }
        });
      })
    }),

    
    on(actionDeleteProfileWorkHistory, (state, action) => {
        return produce(state, draftState => {
            
            draftState.workHistories.splice(state.workHistories.findIndex(x => x.id == action.id), 1);
            
        })
    }),
        // workHistories: {
        //     ...state.workHistories
        // }

    // END PROFILE WORK HISTORY ///////////////////////////////////////////////////////////

    // PROFILE ADDRESS HISTORY ////////////////////////////////////////////////////////////

    on(actionUpdateProfileAddressHistory, (state, {id, address}) => {
        return produce(state, draftState => {
            draftState.addresses[state.addresses.findIndex(x => x.id === id)].item = address;
    })}),

    on(actionUpdateProfileAddressHistoryField, (state, {id, fieldName, fieldValue}) => {
        return produce(state, draftState => {
            draftState.addresses[state.addresses.findIndex(x => x.id === id)].item[fieldName] = fieldValue;
    })}),

    
    on(actionInsertProfileAddressHistory, (state, action) => {
        const ids = state.addresses.map(object => {
            return object.id;
          });
          let myId = 0;
          if (ids.length > 0) {
            const maxId = Math.max(...ids);
            myId = maxId + 1;
          }

        return produce(state, draftState => {
            draftState.addresses.push({ id: myId, item: {id: myId, startDate: action.startDate, endDate: action.endDate, addressType: action.addressType, address1: action.address1, address2: action.address2, city: action.city, state: action.state, zip: action.zip, }});
        })
    }),

    on(actionDeleteProfileAddressHistory, (state, action) => {
        return produce(state, draftState => {
            
            draftState.addresses.splice(state.addresses.findIndex(x => x.id == action.id), 1);
            
        })
    }),

    on(actionProcessProfileImageInfoFromUploadCare, (state, action) => {
        const ids = state.images.map(object => {
            return object.id;
          });
          let myId = 0;
          if (ids.length > 0) {
            const maxId = Math.max(...ids);
            myId = maxId + 1;
          }

        return produce(state, draftState => {
            
            draftState.images.push({ id: myId, item: {id: myId, imageType: action.imageType, uuid: action.uuid, originalUrl: action.originalUrl, cdnUrl: action.cdnUrl, name: action.name, mimeType: action.mimeType, size: action.size }});
        })
    }),

    on(actionRemoveActiveProfilePicture, (state, action) => {
        return produce(state, draftState => {
            draftState.images[state.images.findIndex(x => x.item.imageType === "profileActive")].item.imageType = 'profile';
            return draftState;
            
        })
    }),

    on(actionChangeActiveProfilePicture, (state, action) => {
        return produce(state, draftState => {
            draftState.images[state.images.findIndex(x => x.item.imageType === "profileActive")].item.imageType = 'profile';
            draftState.images[state.images.findIndex(x => x.item.uuid === action.uuid)].item.imageType = 'profileActive';
            return draftState;
            
        })

    }),

    on(actionUpdateProfilePermissions, (state, action) => {
        return produce(state, draftState => {
            draftState.permissions = action.permissions;
        })
    })
    

);


export function profileReducer(
    state: ProfileState | undefined,
    action: Action
) {
    return reducer(state, action);
    
}

