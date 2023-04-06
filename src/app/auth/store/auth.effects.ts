import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { switchMap, catchError, map, tap } from "rxjs/operators";
import { of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

import * as AuthActions from "./auth.actions";
import { User } from "../user.model";
import { AuthService } from "../auth.service";

export interface AuthResponseData {
  data: {
    access_token: string;
    existingUser: {
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
  // expirationDate: Date;
}

const handleAuthentication = (
  data: {
    access_token: string;
    existingUser: {
      userName: string;
      email: string;
      role: string;
      forgetPwdToken: string;
      forgetPwdExpires: Date;
      deleted: string;
      _id: string;
      __v: number;
    };
  },
  message: string
) => {
  // console.log("data from handle auth function", data.access_token);

  const expirationDate = new Date(new Date().getTime() + 600 * 1000);
  const user = new User(
    data.access_token,
    data.existingUser.userName,
    data.existingUser.email,
    data.existingUser.role,
    data.existingUser.forgetPwdToken,
    data.existingUser.forgetPwdExpires,
    data.existingUser.deleted,
    data.existingUser._id,
    data.existingUser.__v,
    message,
    expirationDate
  );
  console.log("user from auth handle function", user);

  localStorage.setItem("userData", JSON.stringify(user));
  // console.log("check 1");

  const payload = {
    data: {
      access_token: data.access_token,
      existingUser: {
        userName: data.existingUser.userName,
        email: data.existingUser.email,
        role: data.existingUser.role,
        forgetPwdToken: data.existingUser.forgetPwdToken,
        forgetPwdExpires: data.existingUser.forgetPwdExpires,
        deleted: data.existingUser.deleted,
        _id: data.existingUser._id,
        __v: data.existingUser.__v,
      },
    },
    message: message,
    expirationDate: expirationDate,
    redirect: true,
  };
  // console.log("check 2");

  // console.log("success", new AuthActions.AuthenticateSuccess(payload));

  return new AuthActions.AuthenticateSuccess(payload);
};

const handleError = (errorRes: any) => {
  let errorMessage = "An unknown error occurred!";
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case "EMAIL_EXISTS":
      errorMessage = "This email exists already";
      break;
    case "EMAIL_NOT_FOUND":
      errorMessage = "This email does not exist.";
      break;
    case "INVALID_PASSWORD":
      errorMessage = "This password is not correct.";
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      console.log("signupAction.payload.userName", signupAction.payload);

      return this.http
        .post<AuthResponseData>(
          "http://localhost:3000/users/create",
          // +environment.firebaseAPIKey
          {
            userName: signupAction.payload.userName,
            email: signupAction.payload.email,
            // password: signupAction.payload.password,
            // returnSecureToken: true,
          }
        )
        .pipe(
          tap((resData) => {
            console.log("resData", resData);

            this.authService.setLogoutTimer(600 * 1000);
          }),
          map((resData) => {
            const data = {
              access_token: resData.data.access_token,
              existingUser: {
                userName: resData.data.existingUser.userName,
                email: resData.data.existingUser.email,
                role: resData.data.existingUser.role,
                forgetPwdToken: resData.data.existingUser.forgetPwdToken,
                forgetPwdExpires: resData.data.existingUser.forgetPwdExpires,
                deleted: resData.data.existingUser.deleted,
                _id: resData.data.existingUser._id,
                __v: resData.data.existingUser.__v,
              },
            };
            console.log("inside map", data);

            return handleAuthentication(
              data,
              resData.message
              // resData.expiration,
              // resData.redirect
            );
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(
          "http://localhost:3000/users/login",
          //  +environment.firebaseAPIKey
          {
            email: authData.payload.email,
            password: authData.payload.password,
            // returnSecureToken: true,
          }
        )
        .pipe(
          tap((resData) => {
            // console.log("from tap", resData);

            this.authService.setLogoutTimer(600 * 1000);
          }),
          map((resData) => {
            // console.log("resData", resData.data.access_token);

            const data = {
              access_token: resData.data.access_token,
              existingUser: {
                userName: resData.data.existingUser.userName,
                email: resData.data.existingUser.email,
                role: resData.data.existingUser.role,
                forgetPwdToken: resData.data.existingUser.forgetPwdToken,
                forgetPwdExpires: resData.data.existingUser.forgetPwdExpires,
                deleted: resData.data.existingUser.deleted,
                _id: resData.data.existingUser._id,
                __v: resData.data.existingUser.__v,
              },
            };
            // console.log("from map", data);

            return handleAuthentication(data, resData.message);
          }),
          catchError((errorRes) => {
            // console.log("errorRes", errorRes);

            return handleError(errorRes);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(["/"]);
      }
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      // console.log("userData from local storage", userData);

      if (!userData) {
        return { type: "DUMMY" };
      }

      const loadedUser = new User(
        userData.access_token,
        userData.userName,
        userData.email,
        userData.role,
        userData.forgetPwdToken,
        userData.forgetPwdExpires,
        userData.deleted,
        userData._id,
        userData.__v,
        userData.message,
        new Date(userData.expirationDate)
        // new Date(userData._tokenExpirationDate)
      );
      // console.log("loadedUser", loadedUser);

      if (loadedUser.access_token) {
        // this.user.next(loadedUser);
        const expirationDuration =
          new Date(userData.expirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.AuthenticateSuccess({
          data: {
            access_token: loadedUser.access_token,
            existingUser: {
              userName: loadedUser.userName,
              email: loadedUser.email,
              role: loadedUser.role,
              forgetPwdToken: loadedUser.forgetPwdToken,
              forgetPwdExpires: loadedUser.forgetPwdExpires,
              deleted: loadedUser.deleted,
              _id: loadedUser._id,
              __v: loadedUser.__v,
            },
          },
          message: loadedUser.message,
          expirationDate: new Date(userData.expirationDate),
          redirect: false,
        });

        // const expirationDuration =
        //   new Date(userData._tokenExpirationDate).getTime() -
        //   new Date().getTime();
        // this.autoLogout(expirationDuration);
      }
      return { type: "DUMMY" };
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem("userData");
      this.router.navigate(["/auth"]);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
