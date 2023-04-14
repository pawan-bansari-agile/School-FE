import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { switchMap, catchError, map, tap } from "rxjs/operators";
import { of } from "rxjs";
import { HttpClient } from "@angular/common/http";

import * as AuthActions from "./auth.actions";
import { User } from "../user.model";
import { AuthService } from "../auth.service";
import { School } from "src/app/auth/school.model";

export interface AuthResponseData {
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
  // expirationDate: Date;
}

export interface SchoolAuthResponseData {
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
    data.user.userName,
    data.user.email,
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

  localStorage.setItem("userData", JSON.stringify(user));
  // console.log("check 1");

  const payload = {
    data: {
      access_token: data.access_token,
      user: {
        userName: data.user.userName,
        email: data.user.email,
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
  // console.log("check 2");

  // console.log("success", new AuthActions.AuthenticateSuccess(payload));

  return new AuthActions.AuthenticateSuccess(payload);
};

const SchoolHandleAuthentication = (
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

  return new AuthActions.SchoolAuthenticateSuccess(payload);
};

const handleError = (errorRes: any) => {
  // console.log("errorRes", errorRes);

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

const SchoolhandleError = (errorRes: any) => {
  console.log("errorRes", errorRes);

  let errorMessage = "An unknown error occurred!";
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.SchoolAuthenticateFail(errorMessage));
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
  return of(new AuthActions.SchoolAuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      // console.log("signupAction.payload.userName", signupAction.payload);

      return this.http
        .post<AuthResponseData>(
          "http://localhost:3000/users/create",
          // +environment.firebaseAPIKey
          {
            userName: signupAction.payload.userName,
            email: signupAction.payload.email,
            role: signupAction.payload.role,
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
            // console.log("check1", resData.data);

            const data = {
              access_token: resData.data.access_token,
              user: {
                userName: resData.data.user.userName,
                email: resData.data.user.email,
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
  schoolAuthSignup = this.actions$.pipe(
    ofType(AuthActions.SCHOOL_SIGNUP_START),
    switchMap((signupAction: AuthActions.SchoolSignupStart) => {
      console.log("signupAction.payload.userName", signupAction.payload);

      return this.http
        .post<SchoolAuthResponseData>(
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

            return SchoolHandleAuthentication(
              data,
              resData.message
              // resData.expiration,
              // resData.redirect
            );
          }),
          catchError((errorRes) => {
            // console.log("errorRes", errorRes.toString());

            return SchoolhandleError(errorRes);
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
              user: {
                userName: resData.data.user.userName,
                email: resData.data.user.email,
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

  @Effect()
  schoolAuthLogin = this.actions$.pipe(
    ofType(AuthActions.SCHOOL_LOGIN_START),
    switchMap((authData: AuthActions.SchoolLoginStart) => {
      return this.http
        .post<SchoolAuthResponseData>(
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

            return SchoolHandleAuthentication(data, resData.message);
          }),
          catchError((errorRes) => {
            // console.log("errorRes", errorRes);

            return SchoolhandleError(errorRes);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(["/dashboard"]);
      }
    })
  );

  @Effect({ dispatch: false })
  schoolAuthRedirect = this.actions$.pipe(
    ofType(AuthActions.SCHOOL_AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.SchoolAuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        console.log("inside success redirect");

        console.log("before");

        this.router.navigate(["/schools"]);
        console.log("after");
      }
    })
  );

  // @Effect()
  // autoLogin = this.actions$.pipe(
  //   ofType(AuthActions.AUTO_LOGIN),
  //   map(() => {
  //     const userData = JSON.parse(localStorage.getItem("userData"));
  //     const schoolData = JSON.parse(localStorage.getItem("schoolData"));
  //     console.log("inside autologin user", userData);
  //     console.log("inside autologin school", schoolData);

  //     if (!userData) {
  //       return { type: "DUMMY" };
  //     }

  //     const loadedUser = new User(
  //       userData.access_token,
  //       userData.userName,
  //       userData.email,
  //       userData.role,
  //       userData.forgetPwdToken,
  //       userData.forgetPwdExpires,
  //       userData.deleted,
  //       userData._id,
  //       userData.__v,
  //       userData.message,
  //       new Date(userData.expirationDate)
  //       // new Date(userData._tokenExpirationDate)
  //     );
  //     // console.log("loadedUser", loadedUser);

  //     if (loadedUser.access_token) {
  //       // this.user.next(loadedUser);
  //       const expirationDuration =
  //         new Date(userData.expirationDate).getTime() - new Date().getTime();
  //       this.authService.setLogoutTimer(expirationDuration);
  //       return new AuthActions.AuthenticateSuccess({
  //         data: {
  //           access_token: loadedUser.access_token,
  //           user: {
  //             userName: loadedUser.userName,
  //             email: loadedUser.email,
  //             role: loadedUser.role,
  //             forgetPwdToken: loadedUser.forgetPwdToken,
  //             forgetPwdExpires: loadedUser.forgetPwdExpires,
  //             deleted: loadedUser.deleted,
  //             _id: loadedUser._id,
  //             __v: loadedUser.__v,
  //           },
  //         },
  //         message: loadedUser.message,
  //         expirationDate: new Date(userData.expirationDate),
  //         redirect: false,
  //       });

  //       // const expirationDuration =
  //       //   new Date(userData._tokenExpirationDate).getTime() -
  //       //   new Date().getTime();
  //       // this.autoLogout(expirationDuration);
  //     }
  //     return { type: "DUMMY" };
  //   })
  // );

  // @Effect()
  // schoolAutoLogin = this.actions$.pipe(
  //   ofType(AuthActions.SCHOOL_AUTO_LOGIN),
  //   map(() => {
  //     const userData = JSON.parse(localStorage.getItem("schoolData"));
  //     console.log("inside school suto login", userData);

  //     if (!userData) {
  //       return { type: "DUMMY" };
  //     }

  //     const loadedUser = new School(
  //       userData.access_token,
  //       userData.name,
  //       userData.email,
  //       userData.address,
  //       userData.photo,
  //       userData.zipCode,
  //       userData.city,
  //       userData.state,
  //       userData.country,
  //       userData.role,
  //       userData.forgetPwdToken,
  //       userData.forgetPwdExpires,
  //       userData.deleted,
  //       userData._id,
  //       userData.__v,
  //       userData.message,
  //       new Date(userData.expirationDate)
  //       // new Date(userData._tokenExpirationDate)
  //     );
  //     // console.log("loadedUser", loadedUser);

  //     if (loadedUser.access_token) {
  //       // this.user.next(loadedUser);
  //       const expirationDuration =
  //         new Date(userData.expirationDate).getTime() - new Date().getTime();
  //       this.authService.setLogoutTimer(expirationDuration);
  //       return new AuthActions.SchoolAuthenticateSuccess({
  //         data: {
  //           access_token: loadedUser.access_token,
  //           user: {
  //             name: loadedUser.name,
  //             email: loadedUser.email,
  //             address: loadedUser.address,
  //             photo: loadedUser.photo,
  //             zipCode: loadedUser.zipCode,
  //             city: loadedUser.city,
  //             state: loadedUser.state,
  //             country: loadedUser.country,
  //             role: loadedUser.role,
  //             forgetPwdToken: loadedUser.forgetPwdToken,
  //             forgetPwdExpires: loadedUser.forgetPwdExpires,
  //             deleted: loadedUser.deleted,
  //             _id: loadedUser._id,
  //             __v: loadedUser.__v,
  //           },
  //         },
  //         message: loadedUser.message,
  //         expirationDate: new Date(userData.expirationDate),
  //         redirect: false,
  //       });

  //       // const expirationDuration =
  //       //   new Date(userData._tokenExpirationDate).getTime() -
  //       //   new Date().getTime();
  //       // this.autoLogout(expirationDuration);
  //     }
  //     return { type: "DUMMY" };
  //   })
  // );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const schoolData = JSON.parse(localStorage.getItem("schoolData"));
      console.log("inside autologin user", userData);
      console.log("inside autologin school", schoolData);

      if (!userData && !schoolData) {
        return { type: "DUMMY" };
      }

      if (userData) {
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
        const expirationDuration =
          new Date(userData.expirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.AuthenticateSuccess({
          data: {
            access_token: loadedUser.access_token,
            user: {
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
      }
      // console.log("loadedUser", loadedUser);

      // if (loadedUser.access_token) {
      // this.user.next(loadedUser);

      // const expirationDuration =
      //   new Date(userData._tokenExpirationDate).getTime() -
      //   new Date().getTime();
      // this.autoLogout(expirationDuration);
      // }
      if (schoolData) {
        const loadedSchool = new School(
          schoolData.access_token,
          schoolData.name,
          schoolData.email,
          schoolData.address,
          schoolData.photo,
          schoolData.zipCode,
          schoolData.city,
          schoolData.state,
          schoolData.country,
          schoolData.role,
          schoolData.forgetPwdToken,
          schoolData.forgetPwdExpires,
          schoolData.deleted,
          schoolData._id,
          schoolData.__v,
          schoolData.message,
          new Date(schoolData.expirationDate)
          // new Date(userData._tokenExpirationDate)
        );
        const expirationDuration =
          new Date(schoolData.expirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.SchoolAuthenticateSuccess({
          data: {
            access_token: loadedSchool.access_token,
            user: {
              name: loadedSchool.name,
              email: loadedSchool.email,
              address: loadedSchool.address,
              photo: loadedSchool.photo,
              zipCode: loadedSchool.zipCode,
              city: loadedSchool.city,
              state: loadedSchool.state,
              country: loadedSchool.country,
              role: loadedSchool.role,
              forgetPwdToken: loadedSchool.forgetPwdToken,
              forgetPwdExpires: loadedSchool.forgetPwdExpires,
              deleted: loadedSchool.deleted,
              _id: loadedSchool._id,
              __v: loadedSchool.__v,
            },
          },
          message: loadedSchool.message,
          expirationDate: new Date(schoolData.expirationDate),
          redirect: false,
        });
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

  @Effect({ dispatch: false })
  schoolAuthLogout = this.actions$.pipe(
    ofType(AuthActions.SCHOOL_LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem("schoolData");
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
