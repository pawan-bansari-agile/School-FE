import { Action } from "@ngrx/store";

export const LOGIN_START = "[SchoolAuth] Login Start";
export const AUTHENTICATE_SUCCESS = "[SchoolAuth] Login";
export const AUTHENTICATE_FAIL = "[SchoolAuth] Login Fail";
export const SIGNUP_START = "[SchoolAuth] Signup Start";
export const CLEAR_ERROR = "[SchoolAuth] Clear Error";
export const AUTO_LOGIN = "[SchoolAuth] Auto Login";
export const LOGOUT = "[SchoolAuth] Logout";

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

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

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string; password: string }) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;

  constructor(public payload: string) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(
    public payload: {
      name: string;
      email: string;
      address: string;
      photo: string;
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

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions =
  | AuthenticateSuccess
  | Logout
  | LoginStart
  | AuthenticateFail
  | SignupStart
  | ClearError
  | AutoLogin;
