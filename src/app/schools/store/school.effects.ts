import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { HttpClient, HttpParams } from "@angular/common/http";
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
}

export interface searchResponse {
  data: [];
  message: string;
}

const handleError = (errorRes: any) => {
  let errorMessage = "An unknown error occurred!";
  console.log(" entry in handle error method", errorRes);

  if (!errorRes.error || !errorRes.error.error) {
    console.log("inside if loop in handle error method", errorRes);

    return of(new SchoolActions.SchoolErrors(errorMessage));
  }
  console.log("outside if loop in handle error method", errorRes);

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
    case "User not found!":
      errorMessage = "User Not Found!";
      break;
    case "Entered email is not available to use! Please use another!":
      errorMessage =
        "Entered email is not available to use! Please use another!";
      break;
    case "You can update own details only!":
      errorMessage = "You can update own details only!";
      break;
    case "Provided email is not linked with any account! Please enter a valid email!":
      errorMessage =
        "Provided email is not linked with any account! Please enter a valid email!";
      break;
    case "Bad Credentials!":
      errorMessage = "Bad Credentials!";
      break;
    case "Password's don't match!":
      errorMessage = "Password's don't match!";
      break;
    case "Session expired! Login again!":
      errorMessage = "Session expired! Login again!";
      break;
    case "School not found!":
      errorMessage = "School not found!";
      break;
    case "Student details not found!":
      errorMessage = "Student details not found!";
      break;
    case "No change detected!":
      errorMessage = "No change detected!";
      break;
  }
  return of(new SchoolActions.SchoolErrors(errorMessage));
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
      // searchParams = searchParams.append("fieldName", `${fieldName}`);
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
          return new SchoolActions.SetSchoolss(res.data);
        })
      );
    }),
    catchError((errRes) => {
      return handleError(errRes);
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
      return new SchoolActions.SearchComplete(school.data.existingSchool);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
