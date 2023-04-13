// import {
//   CanActivate,
//   ActivatedRouteSnapshot,
//   RouterStateSnapshot,
//   Router,
//   UrlTree,
// } from "@angular/router";
// import { Injectable } from "@angular/core";
// import { Observable } from "rxjs";
// import { map, tap, take } from "rxjs/operators";
// import { Store } from "@ngrx/store";

// import { AuthService } from "./auth.service";
// import * as fromApp from "../store/app.reducer";

// @Injectable({ providedIn: "root" })
// export class AuthGuard implements CanActivate {
//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private store: Store<fromApp.AppState>
//   ) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     router: RouterStateSnapshot
//   ):
//     | boolean
//     | UrlTree
//     | Promise<boolean | UrlTree>
//     | Observable<boolean | UrlTree> {
//     return this.store.select("auth").pipe(
//       take(1),
//       map((authState) => {
//         return authState.user;
//       }),
//       map((user) => {
//         const isAuth = !!user;
//         if (isAuth) {
//           return true;
//         }
//         return this.router.createUrlTree(["/auth"]);
//       })
//     );
//   }
// }
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap, take } from "rxjs/operators";
import { Store } from "@ngrx/store";

import { AuthService } from "./auth.service";
import * as fromApp from "../store/app.reducer";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.store.select("auth").pipe(
      take(1),
      map((authState) => {
        const isUserAuth = !!authState.user;
        console.log("isUserAuth in guard", isUserAuth);

        const isSchoolAuth = !!authState.school;
        console.log("isSchoolAuth in guard", isSchoolAuth);

        if (isUserAuth || isSchoolAuth) {
          console.log("inside first if loop in guard");

          return true;
        } else if (!isUserAuth) {
          console.log("inside second if loop in guard");

          return this.router.createUrlTree(["/auth"]);
        } else {
          console.log("inside else loop in guard");

          return this.router.createUrlTree(["/auth"]);
        }
      })
    );
  }
}
