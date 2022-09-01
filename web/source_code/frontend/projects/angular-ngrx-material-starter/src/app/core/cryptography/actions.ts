import { createAction, props } from '@ngrx/store';

export enum CryptographyActionTypes {
  GenerateSignature = '[Cryptography] GenerateSignature'
}

// Business //////////////////////////////////////////////////////////////////////////////

export const actionGenerateSignature = createAction(
    CryptographyActionTypes.GenerateSignature,
    props<{ document: any }>()
);
