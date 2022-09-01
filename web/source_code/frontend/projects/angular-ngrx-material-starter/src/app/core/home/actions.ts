import { createAction, props } from '@ngrx/store';
import { 
    HomeState,
    PublicBusiness
} from './state';

export enum HomeActionTypes {
    NavigateHomeView = '[Home] NavigateHomeView',
    UpdateBusinesses = '[Home] UpdateBusinesses',

}

export const actionNavigateHomeView = createAction(
    HomeActionTypes.NavigateHomeView,
    props<{ route: string }>()
);

export const actionUpdateBusinesses = createAction(
    HomeActionTypes.UpdateBusinesses,
    props<{ businesses: PublicBusiness[] }>()
);


// export const actionSubscribeToBusiness = createAction(
//     BusinessActionTypes.SubscribeToBusiness,
  
// );