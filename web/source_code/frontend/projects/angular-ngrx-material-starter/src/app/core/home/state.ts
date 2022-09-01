import { profileAddress, profileAddressState } from "../profile/state";

export interface PublicBusiness {
  id: string | undefined;
  name: string | undefined;
  dotNumber: string | undefined;
  mcNumber: string | undefined;
  displayName: string | undefined;
  addresses: profileAddressState[];
  activeProfileImage: string | undefined;
  about: string | undefined;
}

export interface HomeState {
  currentView: string;
  homeLoading: boolean;
  businesses: PublicBusiness[];
}

export const initialState: HomeState = {
  currentView: 'my-feed',
  homeLoading: true,
  businesses: [],
}

