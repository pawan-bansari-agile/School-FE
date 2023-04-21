import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { switchMap, map, withLatestFrom, catchError } from "rxjs/operators";

import * as SchoolActions from "./school.actions";
import { School, UpdatedSchool } from "../../auth/school.model";
import * as fromApp from "../../store/app.reducer";
import { of } from "rxjs";

export interface searchOne {
  data: {
    existingSchool: School;
  };
  message: string;
  error: HttpErrorResponse;
}

export interface searchResponse {
  data: [];
  message: string;
  error: HttpErrorResponse;
}

const handleError = (errorRes: any) => {
  console.log("inside handle error ", errorRes);
  let errorMessage = "An unknown error occurred!";
  // if (errorRes.value.error.message) {
  //   errorMessage = "Invalid Id!";
  //   return of(new SchoolActions.SchoolErrors(errorMessage));
  // }
  if (!errorRes.error || !errorRes.error.error) {
    console.log("inside if loop in handle error");

    return of(new SchoolActions.SchoolErrors(errorMessage));
  }
  if (errorRes.error.error.name === "CastError") {
    errorMessage = "Invalid Id!";
  }
  switch (errorRes.error.error.message) {
    case "School not found!":
      errorMessage = "School not found!";
      break;
  }
  return new SchoolActions.SchoolErrors(errorMessage);
};

@Injectable()
export class SchoolEffects {
  @Effect()
  fetchSchools = this.actions$.pipe(
    ofType(SchoolActions.FETCH_SCHOOLS),
    switchMap((actionData: SchoolActions.FetchSchools) => {
      let url = "http://localhost:3000/school/findAll";
      const {
        fieldName,
        fieldValue,
        pageNumber,
        limit,
        keyword,
        sortBy,
        sortOrder,
      } = actionData.payload;

      let searchParams = new HttpParams();
      if (fieldName && fieldValue) {
        searchParams = searchParams.append("fieldName", `${fieldName}`);
        searchParams = searchParams.append("fieldValue", `${fieldValue}`);
      }
      if (pageNumber && limit) {
        searchParams = searchParams.append("pageNumber", `${pageNumber}`);
        searchParams = searchParams.append("limit", `${limit}`);
      }
      if (keyword) {
        searchParams = searchParams.append("keyword", `${keyword}`);
      }
      if (sortBy || sortOrder) {
        if (sortBy && sortOrder) {
          searchParams = searchParams.append("sortBy", `${sortBy}`);
          searchParams = searchParams.append("sortOrder", `${sortOrder}`);
        } else if (sortBy) {
          searchParams = searchParams.append("sortBy", `${sortBy}`);
        } else if (sortOrder) {
          searchParams = searchParams.append("sortOrder", `${sortOrder}`);
        }
      }

      return this.http.get<searchResponse>(url, { params: searchParams }).pipe(
        map((res) => {
          if (res.error) {
            return handleError(res);
          } else {
            return new SchoolActions.SetSchoolss(res.data);
          }
        })
      );
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
      return this.http.get<searchOne>(
        `http://localhost:3000/school/findOne/${action.payload}`
      );
    }),
    map((school) => {
      console.log("inside map", school);

      if (school.error) {
        console.log("inside if loop");

        return handleError(school);
      } else {
        console.log("inside else loop");

        return new SchoolActions.SearchComplete(school.data.existingSchool);
      }
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
