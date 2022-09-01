//import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';


export interface profileWorkHistory {
    id: number | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
    businessName: string | undefined;
    positionsHeld: string | undefined;
    description: string | undefined;
    physicalAddress1: string | undefined;
    physicalAddress2: string | undefined;
    physicalCity: string | undefined;
    physicalState: string | undefined;
    physicalZip: string | undefined;
    mailingAddress1: string | undefined;
    mailingAddress2: string | undefined;
    mailingCity: string | undefined;
    mailingState: string | undefined;
    mailingZip: string | undefined;
    supervisor: string | undefined;
    phoneNumber: string | undefined;
    email: string | undefined;
    website: string | undefined;
}

export interface profileWorkHistoryState {
    id: number,
    item: profileWorkHistory,
}

export interface profileAddress {
    id: number | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
    addressType: string | undefined;
    address1: string | undefined;
    address2: string | undefined;
    city: string | undefined;
    state: string | undefined;
    zip: string | undefined;
}
export interface profileAddressState {
    id: number;
    item: profileAddress;
}

export interface profileImage {
    id: number | undefined;
    imageType: string | undefined;
    uuid: string | undefined;
    originalUrl: string | undefined;
    cdnUrl: string | undefined;
    name: string | undefined;
    mimeType: string | undefined;
    size: number | undefined;
}

export interface profileImageState {
    id: number;
    item: profileImage;
}

export interface profilePermission {
    id: number | undefined;
    fullPermission: string | undefined;
    business: string | undefined;
    permission: string | undefined;
}

export interface profilePermissionsState {
    id: number;
    item: profilePermission;
}

export interface profileBusiness {
    id: number | undefined;
    name: string | undefined;
    permissions: [] | undefined;
}

export interface profileBusinessState {
    id: number | undefined;
    item: profileBusiness;
}

export interface ProfileState {
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    profileId: string;
    gender: string;
    images: profileImageState[];
    privacyStatus: string;
    seekingStatus: string;
    addresses: profileAddressState[];
    workHistories: profileWorkHistoryState[];
    permissions: profilePermissionsState[];
    businesses: profileBusinessState[];
    defaultBusiness: string | undefined;
    // profileId: string;

}

export const initialState: ProfileState = {
    firstName: undefined,
    middleName: undefined,
    lastName: undefined,
    suffix: undefined,
    profileId: undefined,
    gender: undefined,
    privacyStatus: undefined,
    seekingStatus: undefined,
    workHistories: undefined,
    addresses: undefined,
    images: undefined,
    permissions: undefined,
    businesses: undefined,
    defaultBusiness: undefined
    // profileId: undefined
    
};
