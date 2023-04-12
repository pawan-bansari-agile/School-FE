import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { switchMap, catchError, map, tap } from "rxjs/operators";
import { of } from "rxjs";
import { HttpClient } from "@angular/common/http";

import * as SchoolAuthActions from "./schoolAuth.actions";
import { School } from "../school.model";
import { AuthService } from "../schoolAuth.service";

export interface AuthResponseData {
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
  // expirationDate: Date;
}

const handleAuthentication = (
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
  },
  message: string
) => {
  console.log("data from handle auth function", data.access_token);

  const expirationDate = new Date(new Date().getTime() + 600 * 1000);
  const user = new School(
    data.access_token,
    data.user.name,
    data.user.email,
    data.user.address,
    data.user.photo,
    data.user.zipCode,
    data.user.city,
    data.user.state,
    data.user.country,
    data.user.role,
    data.user.forgetPwdToken,
    data.user.forgetPwdExpires,
    data.user.deleted,
    data.user._id,
    data.user.__v,
    message,
    expirationDate
  );
  // console.log("user from auth handle function", user);

  localStorage.setItem("schoolData", JSON.stringify(user));
  // console.log("check 1");

  const payload = {
    data: {
      access_token: data.access_token,
      user: {
        name: data.user.name,
        email: data.user.email,
        address: data.user.address,
        photo: data.user.photo,
        zipCode: data.user.zipCode,
        city: data.user.city,
        state: data.user.state,
        country: data.user.country,
        role: data.user.role,
        forgetPwdToken: data.user.forgetPwdToken,
        forgetPwdExpires: data.user.forgetPwdExpires,
        deleted: data.user.deleted,
        _id: data.user._id,
        __v: data.user.__v,
      },
    },
    message: message,
    expirationDate: expirationDate,
    redirect: true,
  };
  console.log("check 2", payload.redirect);

  // console.log("success", new AuthActions.AuthenticateSuccess(payload));

  return new SchoolAuthActions.AuthenticateSuccess(payload);
};

const handleError = (errorRes: any) => {
  console.log("errorRes", errorRes);

  let errorMessage = "An unknown error occurred!";
  if (!errorRes.error || !errorRes.error.error) {
    return of(new SchoolAuthActions.AuthenticateFail(errorMessage));
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
  return of(new SchoolAuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class SchoolAuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(SchoolAuthActions.SIGNUP_START),
    switchMap((signupAction: SchoolAuthActions.SignupStart) => {
      console.log("signupAction.payload.userName", signupAction.payload);

      return this.http
        .post<AuthResponseData>(
          "http://localhost:3000/school/create",
          // +environment.firebaseAPIKey
          {
            name: signupAction.payload.name,
            email: signupAction.payload.email,
            address: signupAction.payload.address,
            photo: signupAction.payload.photo ? signupAction.payload.photo : "",
            zipCode: signupAction.payload.zipCode.toString(),
            city: signupAction.payload.city,
            state: signupAction.payload.state,
            country: signupAction.payload.country,
            // password: signupAction.payload.password,
            // returnSecureToken: true,
          }
        )
        .pipe(
          tap((resData) => {
            // console.log("resData", resData);

            this.authService.setLogoutTimer(600 * 1000);
          }),
          map((resData) => {
            console.log("check1", resData.data);

            const data = {
              access_token: resData.data.access_token,
              user: {
                name: resData.data.user.name,
                email: resData.data.user.email,
                address: resData.data.user.address,
                photo: resData.data.user.photo,
                zipCode: resData.data.user.zipCode,
                city: resData.data.user.city,
                state: resData.data.user.state,
                country: resData.data.user.country,
                role: resData.data.user.role,
                forgetPwdToken: resData.data.user.forgetPwdToken,
                forgetPwdExpires: resData.data.user.forgetPwdExpires,
                deleted: resData.data.user.deleted,
                _id: resData.data.user._id,
                __v: resData.data.user.__v,
              },
            };
            // console.log("inside map", data, resData);

            return handleAuthentication(
              data,
              resData.message
              // resData.expiration,
              // resData.redirect
            );
          }),
          catchError((errorRes) => {
            // console.log("errorRes", errorRes.toString());

            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(SchoolAuthActions.LOGIN_START),
    switchMap((authData: SchoolAuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(
          "http://localhost:3000/school/login",
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
              user: {
                name: resData.data.user.name,
                email: resData.data.user.email,
                address: resData.data.user.address,
                photo: resData.data.user.photo,
                zipCode: resData.data.user.zipCode,
                city: resData.data.user.city,
                state: resData.data.user.state,
                country: resData.data.user.country,
                role: resData.data.user.role,
                forgetPwdToken: resData.data.user.forgetPwdToken,
                forgetPwdExpires: resData.data.user.forgetPwdExpires,
                deleted: resData.data.user.deleted,
                _id: resData.data.user._id,
                __v: resData.data.user.__v,
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
    ofType(SchoolAuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: SchoolAuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        console.log("inside success redirect");

        console.log("before");

        this.router.navigate(["/"]);
        console.log("after");
      }
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(SchoolAuthActions.AUTO_LOGIN),
    map(() => {
      const userData = JSON.parse(localStorage.getItem("schoolData"));
      // console.log("userData from local storage", userData);

      if (!userData) {
        return { type: "DUMMY" };
      }

      const loadedUser = new School(
        userData.access_token,
        userData.name,
        userData.email,
        userData.address,
        userData.photo,
        userData.zipCode,
        userData.city,
        userData.state,
        userData.country,
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
        return new SchoolAuthActions.AuthenticateSuccess({
          data: {
            access_token: loadedUser.access_token,
            user: {
              name: loadedUser.name,
              email: loadedUser.email,
              address: loadedUser.address,
              photo: loadedUser.photo,
              zipCode: loadedUser.zipCode,
              city: loadedUser.city,
              state: loadedUser.state,
              country: loadedUser.country,
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
    ofType(SchoolAuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem("schoolData");
      this.router.navigate(["/schoolAuth"]);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
