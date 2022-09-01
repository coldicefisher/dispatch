// export interface User {
//     id?: string;
//     email?: string;
//     username?: string;
//     firstName?: string;
//     lastName?: string;
//     loginStatus?: string;
//     // otp_options?: any;
// }

export interface OtpOption {
    id: string;
    display: string;
    fullAddress: string;
    status: string;
    
}


export interface AuthState {
    // is a user authenticated?
    isAuthenticated: boolean;
    // if authenticated, there should be a user object
    
    // error message
    errorMessage: string | undefined;
    loginStatus: string | undefined;
    username: string | undefined;
    //otpOptions: string | undefined;
    otpOptions: OtpOption[];
    //otpOptions: OtpOptions;
    address: string | undefined;
    trustThis: string | undefined;
    
}

export const initialState: AuthState = {
    isAuthenticated: false,
    errorMessage: undefined,
    loginStatus: undefined,
    username: undefined,
    otpOptions: undefined,
    address: undefined,
    trustThis: undefined,
    
};
