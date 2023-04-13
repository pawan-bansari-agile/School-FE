import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Store } from "@ngrx/store";

import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";
import * as RecipeActions from "../recipes/store/recipe.actions";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = "";
  private userSub: Subscription;
  private schoolSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  // ngOnInit() {
  //   this.userSub = this.store
  //     .select("auth")
  //     .pipe(map((authState) => authState.user))
  //     .subscribe((user) => {
  //       this.isAuthenticated = user ? user.role : "";
  //       // console.log(!user);
  //       // console.log(!!user);
  //     });

  //   // this.schoolSub = this.store
  //   //   .select("auth")
  //   //   .pipe(map((authState) => authState.school))
  //   //   .subscribe((school) => {
  //   //     this.isAuthenticated = school ? school.role : "";
  //   //   });
  // }
  // ngOnInit() {
  //   this.userSub = this.store
  //     .select("auth")
  //     .pipe(
  //       map((authState) => {
  //         return {
  //           user: authState.user,
  //           school: authState.school,
  //         };
  //       })
  //     )
  //     .subscribe(({ user, school }) => {
  //       console.log("inside header", user);

  //       this.isAuthenticated = user ? user.role : "";
  //       // this.isAuthenticated = school ? school.role : "";
  //     });
  // }
  // ngOnInit() {
  //   this.userSub = this.store.select("auth").subscribe((authState) => {
  //     console.log(authState.school);
  //     this.isAuthenticated = authState.user ? authState.user.role : "";
  //     // this.isAuthenticated = authState.school ? authState.school.role : "";
  //     console.log("check 3", this.isAuthenticated);
  //   });
  // }
  ngOnInit() {
    this.userSub = this.store.select("auth").subscribe((authState) => {
      console.log(authState.school);
      this.isAuthenticated = authState.user ? authState.user.role : "";
      if (authState.school) {
        this.isAuthenticated = authState.school.role;
      }
      console.log("check 3", this.isAuthenticated);
    });
  }

  onSaveData() {
    // this.dataStorageService.storeRecipes();
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes());
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
