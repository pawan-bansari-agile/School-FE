import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Store } from "@ngrx/store";

import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = "";
  private userSub: Subscription;
  private schoolSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.userSub = this.store.select("auth").subscribe((authState) => {
      this.isAuthenticated = authState.user ? authState.user.role : "";
      if (authState.school) {
        this.isAuthenticated = authState.school.role;
      }
    });
  }

  onLogout() {
    if (this.isAuthenticated === "Admin") {
      this.store.dispatch(new AuthActions.Logout());
    } else {
      this.store.dispatch(new AuthActions.SchoolLogout());
    }
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.schoolSub.unsubscribe();
  }
}
