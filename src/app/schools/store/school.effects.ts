import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { HttpClient } from "@angular/common/http";
import { switchMap, map, withLatestFrom } from "rxjs/operators";

import * as SchoolActions from "./school.actions";
import { School, UpdatedSchool } from "../../auth/school.model";
import * as fromApp from "../../store/app.reducer";

export interface searchResponse {
  data: {
    existingSchool: School;
  };
  message: string;
}

@Injectable()
export class SchoolEffects {
  @Effect()
  fetchSchools = this.actions$.pipe(
    ofType(SchoolActions.FETCH_SCHOOLS),
    switchMap((fetchAction: SchoolActions.FetchSchools) => {
      let url: string = "http://localhost:3000/school/findAll";
      if (fetchAction.payload.fieldName && fetchAction.payload.fieldValue) {
        url = `http://localhost:3000/school/findAll?${fetchAction.payload.fieldName}=${fetchAction.payload.fieldValue}`;
      }
      if (fetchAction.payload.pageNumber || fetchAction.payload.limit) {
        url = `http://localhost:3000/school/findAll?pageNumber=${fetchAction.payload.pageNumber}&limit=${fetchAction.payload.limit}`;
      }
      if (fetchAction.payload.keyword) {
        url = `http://localhost:3000/school/findAll?keyword=${fetchAction.payload.keyword}`;
      }
      if (fetchAction.payload.sortBy || fetchAction.payload.sortOrder) {
        url = `http://localhost:3000/school/findAll?sortBy=${fetchAction.payload.sortBy}&${fetchAction.payload.sortOrder}`;
      }
      return this.http.get<School[]>(url);
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
      return new SchoolActions.SetSchoolss(schools);
    })
  );

  @Effect({ dispatch: false })
  setSchool = this.actions$.pipe(
    ofType(SchoolActions.SET_SCHOOLS),
    withLatestFrom(this.store.select("schools")),
    map(([actionsData, schoolState]) => {
      localStorage.setItem(
        "selectedSchool",
        JSON.stringify(schoolState.school)
      );
    })
  );

  @Effect({ dispatch: false })
  updateSchool = this.actions$.pipe(
    ofType(SchoolActions.UPDATE_SCHOOL),
    switchMap((updateAction: SchoolActions.UpdateSchool) => {
      return this.http.patch<UpdatedSchool>(
        "http://localhost:3000/school/update",
        {
          name: updateAction.payload.name,
          email: updateAction.payload.email,
          address: updateAction.payload.address,
          photo: updateAction.payload.photo,
          zipCode: updateAction.payload.zipCode,
          city: updateAction.payload.city,
          state: updateAction.payload.state,
          country: updateAction.payload.country,
        }
      );
    })
  );

  @Effect()
  findOneSchool = this.actions$.pipe(
    ofType(SchoolActions.FIND_ONE_SCHOOL),
    switchMap((action: any) => {
      return this.http.get<searchResponse>(
        `http://localhost:3000/school/findOne/${action.payload}`
      );
    }),
    map((school) => {
      return new SchoolActions.SearchComplete(school.data.existingSchool);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
