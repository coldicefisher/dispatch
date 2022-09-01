import produce from "immer";

import { createSelector } from '@ngrx/store';

import { selectHomeState } from '../core.state';
import { HomeState, PublicBusiness } from './state';
import { profileAddress } from "../profile/state";

export const selectCurrentHomeView = createSelector(
  selectHomeState,
  (state: HomeState) => state.currentView
);

export const selectPublicBusinesses = createSelector(
  selectHomeState,
  (state: HomeState) => state.businesses
);

export const selectPublicBusinessesWithCurrentAddresses = createSelector(
  selectHomeState,
  (state: HomeState) => {
    let businesses: Object[] = [ ];
    
    for (let business of state.businesses) {
      let mailAddresses: Object[] = [ ];
      let phyAddresses: Object[] = [ ];
    
      for (let address of business.addresses) {
        
        if (address.item.addressType == 'Physical') { 
          if (address.item.endDate == null || address.item.endDate == '') {phyAddresses.push(address.item) }
        }
        if (address.item.addressType == 'Mailing') {
          if (address.item.endDate == null || address.item.endDate == '') { mailAddresses.push(address.item) }
        }
      }
      businesses.push({
        id: business.id,
        name: business.name,
        displayName: business.displayName,
        about: business.about,
        dotNumber: business.dotNumber,
        mcNumber: business.mcNumber,
        activeProfileImage: business.activeProfileImage,
        'mailingAddresses': mailAddresses,
        'physicalAddresses': phyAddresses,
        
      })
    }
    return businesses;
  }
);

export const selectPublicBusinessWithCurrentAddresses = (id: string) => createSelector(
  selectHomeState,
  (state: HomeState) => {
    let business: {} = {};
    let i = state.businesses.findIndex(x => x.id === id);
    console.log(i);
    if (i < 0) { return null};
    
    let currentBusiness = state.businesses[i];
    business = {
      id: currentBusiness.id,
      name: currentBusiness.name,
      about: currentBusiness.about,
      displayName: currentBusiness.displayName,
      activeProfileImage: currentBusiness.activeProfileImage,
      dotNumber: currentBusiness.dotNumber,
      mcNumber: currentBusiness.mcNumber
    }
    let mailAddresses: Object[] = [ ];
    let phyAddresses: Object[] = [ ];
  
    for (let address of currentBusiness.addresses) {
      
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

export const selectIsHomeLoading = createSelector(
  selectHomeState,
  (state: HomeState) => state.homeLoading
);