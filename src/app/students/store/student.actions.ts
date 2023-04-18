import { Action } from "@ngrx/store";

import { Student } from "../student.model";

export const SET_STUDENTS = "[Students] Set Students";
export const FETCH_STUDENTS = "[Students] Fetch Students";
export const UPDATE_STUDENT = "[Student] Update Student";
export const DELETE_STUDENT = "[Student] Delete Student";
export const FIND_ONE_STUDENT = "[Student] Find One Student";
export const AUTO_FETCH = "[Student] Auto Fetch";
export const SET_STUDENTSS = "[Students] Set Studentss";
export const SEARCH_COMPLETE = "[Student] Search Complete";
export const ADD_STUDENT = "[Student] Add Student";

export class AddStudent implements Action {
  readonly type = ADD_STUDENT;
  constructor(
    public payload: {
      name: string;
      parentNumber: number;
      address: string;
      std: number;
      dob: Date;
    }
  ) {}
}

export class SetStudents implements Action {
  readonly type = SET_STUDENTS;

  constructor(public payload: Student) {}
}

export class SetStudentss implements Action {
  readonly type = SET_STUDENTSS;
  constructor(public payload: Student[]) {}
}

export class FetchStudents implements Action {
  readonly type = FETCH_STUDENTS;
  constructor(public payload: Student[]) {}
}

export class UpdateStudent implements Action {
  readonly type = UPDATE_STUDENT;

  constructor(
    public payload: {
      name: string;
      address: string;
      photo: string;
      _id: string;
      parentNumber: number;
      std: number;
      dob: Date;
      status: boolean;
    }
  ) {}
}

export class DeleteStudent implements Action {
  readonly type = DELETE_STUDENT;
  constructor(public payload: string) {}
}

export class FindOneStudent implements Action {
  readonly type = FIND_ONE_STUDENT;

  constructor(public payload: string) {}
}

export class SearchComplete implements Action {
  readonly type = SEARCH_COMPLETE;

  constructor(public payload: Student) {}
}

export class AutoFetch implements Action {
  readonly type = AUTO_FETCH;
}

export type StudentActions =
  | SetStudents
  | SetStudentss
  | FetchStudents
  | UpdateStudent
  | DeleteStudent
  | FindOneStudent
  | AutoFetch
  | SearchComplete
  | AddStudent;
