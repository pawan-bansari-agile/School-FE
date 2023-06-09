import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders,
} from "@angular/common/http";
import { take, exhaustMap, map } from "rxjs/operators";
import { Store } from "@ngrx/store";

import { AuthService } from "./auth.service";
import * as fromApp from "../store/app.reducer";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select("auth").pipe(
      take(1),
      map((authState) => {
        return { user: authState.user, school: authState.school };
      }),
      exhaustMap(({ user, school }) => {
        if (
          (!user || !user.access_token) &&
          (!school || !school.access_token)
        ) {
          return next.handle(req);
        }

        let token = "";
        if (user && user.access_token) {
          token = user.access_token;
        } else if (school && school.access_token) {
          token = school.access_token;
        }

        const modifiedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });

        return next.handle(modifiedReq);
      })
    );
  }
}
