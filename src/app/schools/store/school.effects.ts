import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';

import * as SchoolActions from './school.actions';
import { School, UpdatedSchool } from '../../auth/school.model';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class SchoolEffects {
  // @Effect()
  // fetchSchools = this.actions$.pipe(
  //   ofType(SchoolActions.FETCH_SCHOOLS),
  //   switchMap(() => {
  //     return this.http.get<School[]>('http://localhost:3000/school/findAll');
  //   }),
  //   map((schools) => {
  //     return schools.map((school) => {
  //       return {
  //         ...school,
  //       };
  //     });
  //   }),
  //   map((schools) => {
  //     localStorage.setItem('schools', JSON.stringify(schools));
  //     return new SchoolActions.SetSchools(schools);
  //   }),
  // );

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

  @Effect({ dispatch: false })
  setSchool = this.actions$.pipe(
    ofType(SchoolActions.SET_SCHOOLS),
    withLatestFrom(this.store.select('schools')),
    map(([actionsData, schoolState]) => {
      localStorage.setItem(
        'selectedSchool',
        JSON.stringify(schoolState.school),
      );
      // return;
    }),
  );

  @Effect({ dispatch: false })
  updateSchool = this.actions$.pipe(
    ofType(SchoolActions.UPDATE_SCHOOL),
    switchMap((updateAction: SchoolActions.UpdateSchool) => {
      return this.http.patch<UpdatedSchool>(
        'http://localhost:3000/school/update',
        {
          name: updateAction.payload.name,
          email: updateAction.payload.email,
          address: updateAction.payload.address,
          photo: updateAction.payload.photo,
          zipCode: updateAction.payload.zipCode,
          city: updateAction.payload.city,
          state: updateAction.payload.state,
          country: updateAction.payload.country,
        },
      );
    }),
    map((school) => {
      console.log('school ffrom school effect', school);

      const payload = { ...school, _id: school._id };
      // return new SchoolActions.UpdateSchool(payload);
    }),
  );

  @Effect()
  findOneSchool = this.actions$.pipe(
    ofType(SchoolActions.FIND_ONE_SCHOOL),
    switchMap(() => {
      return this.http.get<School>('http://localhost:3000/school/findOne/:id');
    }),
    map((school) => {
      return new SchoolActions.FindOneSchool(school._id);
    }),
  );

  // @Effect()
  // autoFetch = this.actions$.pipe(
  //   ofType(SchoolActions.AUTO_FETCH),
  //   map(() => {
  //     const selectedSchool = JSON.parse(localStorage.getItem('selectedSchool'));
  //     return new SchoolActions.SetSchools(selectedSchool);
  //   }),
  // );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
  ) {}
}
