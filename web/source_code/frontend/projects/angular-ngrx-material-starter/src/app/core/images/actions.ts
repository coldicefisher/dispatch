
import { createAction, props } from '@ngrx/store';

export enum ImageActionTypes {
    // ImageUpload = '[Image] ImageUpload',
    // ImageUploadToCloudflare = '[Image] ImageUploadToCloudflare',
    ProcessProfileImageInfoFromUploadCare = '[Image] ProcessProfileImageInfoFromUploadCare',
    ChangeActiveProfileImage = '[Image] ChangeActiveProfileImage',
    RemoveActiveProfileImage = '[Image] RemoveActiveProfileImage',
    ProcessBusinessProfileImageInfoFromUploadCare = '[Image] ProcessBusinessProfileImageInfoFromUploadCare',
    ChangeActiveBusinessProfileImage = '[Image] ChangeActiveBusinessProfileImage',
    RemoveActiveBusinessProfileImage = '[Image] RemoveActiveBusinesProfileImage',
    // ImageUploadSuccess = '[Image] ImageUploadSuccess',
    // ImageUploadFailure = '[Image] ImageUploadFailure',
}

// export const actionImageUpload = createAction(
//     ImageActionTypes.ImageUpload,
//     props<{ image: File }>()

// );
// export const actionImageUploadToCloudflare = createAction(
//     ImageActionTypes.ImageUploadToCloudflare,
//     props<{ image: File }>()
// )
// export const actionImageUploadSuccess = createAction(
//     ImageActionTypes.ImageUploadSuccess,
//     props<{ fileName: string }>()
// );

// export const actionImageUploadFailure = createAction(
//     ImageActionTypes.ImageUploadFailure,
//     props<{ fileName: string }>()
// );

export const actionProcessProfileImageInfoFromUploadCare = createAction(
    ImageActionTypes.ProcessProfileImageInfoFromUploadCare,
    props<{ imageType: string, uuid: string, originalUrl: string, cdnUrl: string, name: string, mimeType: string, size: number  }>()
);

export const actionProcessBusinessProfileImageInfoFromUploadCare = createAction(
  ImageActionTypes.ProcessBusinessProfileImageInfoFromUploadCare,
  props<{ imageType: string, uuid: string, originalUrl: string, cdnUrl: string, name: string, mimeType: string, size: number  }>()
);

export const actionRemoveActiveProfilePicture = createAction(
    ImageActionTypes.RemoveActiveProfileImage,
);

export const actionChangeActiveProfilePicture = createAction(
    ImageActionTypes.ChangeActiveProfileImage,
    props<{ uuid: string }>()
);

export const actionChangeActiveBusinessProfilePicture = createAction(
  ImageActionTypes.ChangeActiveBusinessProfileImage,
  props<{ uuid: string }>()
)