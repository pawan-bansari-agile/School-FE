import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { HttpClient } from "@angular/common/http";
import { switchMap, map, withLatestFrom } from "rxjs/operators";

import * as SchoolActions from "./school.actions";
import { School } from "../../auth/school.model";
import * as fromApp from "../../store/app.reducer";

@Injectable()
export class SchoolEffects {
  @Effect()
  fetchSchools = this.actions$.pipe(
    ofType(SchoolActions.FETCH_SCHOOLS),
    switchMap(() => {
      return this.http.get<School[]>("http://localhost:3000/school/findAll");
    }),
    map((schools) => {
      return schools.map((school) => {
        return {
          ...school,
        };
      });
    }),
    map((schools) => {
      localStorage.setItem("schools", JSON.stringify(schools));
      return new SchoolActions.SetSchools(schools);
    })
  );

  // @Effect({ dispatch: false })
  // storeRecipes = this.actions$.pipe(
  //   ofType(RecipesActions.STORE_RECIPES),
  //   withLatestFrom(this.store.select("recipes")),
  //   switchMap(([actionData, recipesState]) => {
  //     return this.http.put(
  //       "https://ng-course-recipe-book-65f10.firebaseio.com/recipes.json",
  //       recipesState.recipes
  //     );
  //   })
  // );

  @Effect()
  updateSchool = this.actions$.pipe(
    ofType(SchoolActions.UPDATE_SCHOOL),
    switchMap((updateAction: SchoolActions.UpdateSchool) => {
      return this.http.patch<School>("http://localhost:3000/school/update", {
        name: updateAction.payload.newSchool.name,
        email: updateAction.payload.newSchool.email,
        address: updateAction.payload.newSchool.address,
        photo: updateAction.payload.newSchool.photo,
        zipCode: updateAction.payload.newSchool.zipCode,
        city: updateAction.payload.newSchool.city,
        state: updateAction.payload.newSchool.state,
        country: updateAction.payload.newSchool.country,
      });
    }),
    map((school) => {
      const payload = {
        index: school._id,
        newSchool: school,
      };
      return new SchoolActions.UpdateSchool(payload);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
