import { Action } from "@ngrx/store";

export const LOGIN_START = "[Auth] Login Start";
export const AUTHENTICATE_SUCCESS = "[Auth] Login";
export const AUTHENTICATE_FAIL = "[Auth] Login Fail";
export const SIGNUP_START = "[Auth] Signup Start";
export const CLEAR_ERROR = "[Auth] Clear Error";
export const AUTO_LOGIN = "[Auth] Auto Login";
export const LOGOUT = "[Auth] Logout";
export const SCHOOL_AUTHENTICATE_SUCCESS = "[Auth] School Login";
export const SCHOOL_LOGOUT = "[Auth] School Logout";
export const SCHOOL_LOGIN_START = "[Auth] School Login Start";
export const SCHOOL_AUTHENTICATE_FAIL = "[Auth] School Login Fail";
export const SCHOOL_SIGNUP_START = "[Auth] School Signup Start";
export const SCHOOL_CLEAR_ERROR = "[Auth] School Clear Error";
export const SCHOOL_AUTO_LOGIN = "[Auth] School Auto Login";

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

  constructor(
    public payload: {
      data: {
        access_token: string;
        user: {
          userName: string;
          email: string;
          role: string;
          forgetPwdToken: string;
          forgetPwdExpires: Date;
          deleted: string;
          _id: string;
          __v: number;
        };
      };
      message: string;
      expirationDate: Date;
      redirect: boolean;
    }
  ) {}
}

export class SchoolAuthenticateSuccess implements Action {
  readonly type = SCHOOL_AUTHENTICATE_SUCCESS;

  constructor(
    public payload: {
      data: {
        access_token: string;
        user: {
          name: string;
          email: string;
          address: string;
          photo: string;
          zipCode: number;
          city: string;
          state: string;
          country: string;
          role: string;
          forgetPwdToken: string;
          forgetPwdExpires: Date;
          deleted: string;
          _id: string;
          __v: number;
        };
      };
      message: string;
      expirationDate: Date;
      redirect: boolean;
    }
  ) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class SchoolLogout implements Action {
  readonly type = SCHOOL_LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string; password: string }) {}
}

export class SchoolLoginStart implements Action {
  readonly type = SCHOOL_LOGIN_START;

  constructor(public payload: { email: string; password: string }) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;

  constructor(public payload: string) {}
}

export class SchoolAuthenticateFail implements Action {
  readonly type = SCHOOL_AUTHENTICATE_FAIL;

  constructor(public payload: string) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(
    public payload: { userName: string; email: string; role: string }
  ) {}
}

export class SchoolSignupStart implements Action {
  readonly type = SCHOOL_SIGNUP_START;

  constructor(
    public payload: {
      name: string;
      email: string;
      address: string;
      file: File;
      zipCode: number;
      city: string;
      state: string;
      country: string;
    }
  ) {}
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export class SchoolClearError implements Action {
  readonly type = SCHOOL_CLEAR_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class SchoolAutoLogin implements Action {
  readonly type = SCHOOL_AUTO_LOGIN;
}

export type AuthActions =
  | AuthenticateSuccess
  | Logout
  | LoginStart
  | AuthenticateFail
  | SignupStart
  | ClearError
  | AutoLogin
  | SchoolAuthenticateSuccess
  | SchoolLogout
  | SchoolLoginStart
  | SchoolAuthenticateFail
  | SchoolSignupStart
  | SchoolClearError
  | SchoolAutoLogin;
