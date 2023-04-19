import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { HttpClient, HttpParams } from "@angular/common/http";
import { switchMap, map, withLatestFrom } from "rxjs/operators";

import * as StudentActions from "./student.actions";
import { Student, UpdatedStudent } from "../student.model";
import * as fromApp from "../../store/app.reducer";

export interface searchResponse {
  data: {
    existingStud: Student[];
  };
  message: string;
}

export interface studentResponse {
  data: [];
  message: string;
}

@Injectable()
export class StudentEffects {
  @Effect({ dispatch: false })
  addStudent = this.actions$.pipe(
    ofType(StudentActions.ADD_STUDENT),
    switchMap((addAction: StudentActions.AddStudent) => {
      return this.http.post<Student>("http://localhost:3000/students/create", {
        name: addAction.payload.name,
        parentNumber: addAction.payload.parentNumber,
        address: addAction.payload.address,
        std: addAction.payload.std,
        dob: addAction.payload.dob,
      });
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
      return this.http.patch<UpdatedStudent>(
        `http://localhost:3000/students/update/${updateAction.payload._id}`,
        {
          name: updateAction.payload.name,
          parentNumber: updateAction.payload.parentNumber,
          address: updateAction.payload.address,
          std: updateAction.payload.std,
          photo: updateAction.payload.photo,
          dob: updateAction.payload.dob,
          status: updateAction.payload.status,
        }
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
      return new StudentActions.SearchComplete(school.data.existingStud[0]);
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
