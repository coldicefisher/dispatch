import { profileAddressState, profileImage, profileImageState } from "../profile/state";

export interface BusinessUser {
  profileId: string | undefined;
  firstName: string | undefined;
  middleName: string | undefined;
  lastName: string | undefined;
  suffix: string | undefined;
  permissions: string[] | undefined;
  profilePicture: string | undefined;
  hasLogin: string | undefined;
  deleted: string | undefined;
  pending: boolean | undefined;
  associationEmail: string | undefined;
}

export interface BusinessProfile {
  images: profileImageState[];
  about: string | undefined;
  addresses: profileAddressState[];
  dotNumber: string | undefined;
  mcNumber: string | undefined;
}

export interface BusinessState {
  name: string;
  uid: string;
  currentView: string;
  users: BusinessUser[];
  pendingUsers: BusinessUser[];
  deletingUsers: BusinessUser[];
  isLoadingUsers: boolean;
  businessProfile: BusinessProfile;
}

export const initialState: BusinessState = {
  name: undefined,
  uid: undefined,
  currentView: undefined,
  users: [],
  pendingUsers: [],
  deletingUsers: [],
  isLoadingUsers: false,
  businessProfile: {
    images: [],
    about: undefined,
    addresses: [],
    dotNumber: undefined,
    mcNumber: undefined,
  }
};
