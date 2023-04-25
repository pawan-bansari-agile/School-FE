import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { switchMap, map, withLatestFrom } from "rxjs/operators";

import * as StudentActions from "./student.actions";
import { Student, UpdatedStudent } from "../student.model";
import * as fromApp from "../../store/app.reducer";
import { of } from "rxjs";

export interface searchResponse {
  data: {
    studentUrl: Student[];
  };
  message: string;
  error: HttpErrorResponse;
}

export interface studentResponse {
  data: [];
  message: string;
  error: HttpErrorResponse;
}

const handleError = (errorRes: any) => {
  let errorMessage = "An unknown error occurred!";

  if (!errorRes.error || !errorRes.error.error) {
    return of(new StudentActions.StudentErrors(errorMessage));
  }

  if (
    errorRes.error.error ==
    "BSONTypeError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer"
  ) {
    errorMessage = "Invalid Id!";
  }
  switch (errorRes.error.error.message) {
    case "Student details not found!":
      errorMessage = "Student details not found!";
      break;
  }
  return new StudentActions.StudentErrors(errorMessage);
};

@Injectable()
export class StudentEffects {
  @Effect({ dispatch: false })
  addStudent = this.actions$.pipe(
    ofType(StudentActions.ADD_STUDENT),
    switchMap((addAction: StudentActions.AddStudent) => {
      const fd = new FormData();
      fd.append("name", addAction.payload.name);
      fd.append("parentNumber", addAction.payload.parentNumber.toString());
      fd.append("address", addAction.payload.address);
      fd.append("std", addAction.payload.std.toString());
      fd.append("dob", addAction.payload.dob.toString());
      fd.append("file", addAction.payload.file, addAction.payload.file.name);
      return this.http.post<Student>(
        "http://localhost:3000/students/create",
        fd
      );
    })
  );

  @Effect()
  fetchStudents = this.actions$.pipe(
    ofType(StudentActions.FETCH_STUDENTS),
    switchMap((actionData: StudentActions.FetchStudents) => {
      let url = "http://localhost:3000/students/findAll";
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

      return this.http.get<studentResponse>(url, { params: searchParams }).pipe(
        map((res) => {
          return new StudentActions.SetStudentss(res.data);
        })
      );
    })
  );

  @Effect({ dispatch: false })
  setStudent = this.actions$.pipe(
    ofType(StudentActions.SET_STUDENTS),
    withLatestFrom(this.store.select("students")),
    map(([actionsData, studentState]) => {
      localStorage.setItem(
        "selectedStudent",
        JSON.stringify(studentState.student)
      );
    })
  );

  @Effect({ dispatch: false })
  updateStudent = this.actions$.pipe(
    ofType(StudentActions.UPDATE_STUDENT),
    switchMap((updateAction: StudentActions.UpdateStudent) => {
      const fd = new FormData();
      fd.append("name", updateAction.payload.name);
      fd.append("parentNumber", updateAction.payload.parentNumber.toString());
      fd.append("address", updateAction.payload.address);
      fd.append("std", updateAction.payload.std.toString());
      fd.append("dob", updateAction.payload.dob.toString());
      fd.append(
        "file",
        updateAction.payload.file,
        updateAction.payload.file.name
      );
      return this.http.patch<UpdatedStudent>(
        `http://localhost:3000/students/update/${updateAction.payload._id}`,
        fd
      );
    })
  );

  @Effect({ dispatch: false })
  statusUpdate = this.actions$.pipe(
    ofType(StudentActions.STATUS_UPDATE),
    switchMap((updateAction: StudentActions.StatusUpdate) => {
      return this.http.patch<UpdatedStudent>(
        `http://localhost:3000/students/update/isActive/${updateAction.payload.id}`,
        { status: !updateAction.payload.status }
      );
    })
  );

  @Effect()
  findOneStudent = this.actions$.pipe(
    ofType(StudentActions.FIND_ONE_STUDENT),
    switchMap((action: any) => {
      return this.http.get<searchResponse>(
        `http://localhost:3000/students/findOne?id=${action.payload}`
      );
    }),
    map((school) => {
      if (school.error) {
        return handleError(school);
      } else {
        return new StudentActions.SearchComplete(school.data.studentUrl[0]);
      }
    })
  );

  @Effect({ dispatch: false })
  deleteStudent = this.actions$.pipe(
    ofType(StudentActions.DELETE_STUDENT),
    switchMap((action: any) => {
      return this.http.delete(
        `http://localhost:3000/students/delete/${action.payload}`
      );
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
