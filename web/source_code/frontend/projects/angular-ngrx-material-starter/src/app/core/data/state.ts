export interface UserByName {

  firstName: string | undefined;
  middleName: string | undefined;
  lastName: string | undefined;
  suffix: string | undefined;
  fullName: string | undefined;
  profileId: string | undefined;
}
export interface UserByNameState {
  id: number | undefined;
  item: UserByName | undefined;
}

export interface UsersDataState {
  usersByName: UserByNameState[] | undefined;
}
export const initialState: UsersDataState = {
  usersByName: undefined
};

















// export interface EmailsDataState {
//   email: string;
//   username: string;
// }

// export const initialEmailsDataState: EmailsDataState = {
//   email: undefined,
//   username: undefined
// }

// export interface PhoneNumbersDataState {
//   phoneNumber: string,
//   username: string
// }

// export const initialPhoneNumbersDataService: PhoneNumbersDataState = {
//   phoneNumber: undefined,
//   username: undefined
// }
