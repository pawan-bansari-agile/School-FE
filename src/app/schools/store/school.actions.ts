import { Action } from "@ngrx/store";

import { School } from "../../auth/school.model";

export const SET_SCHOOLS = "[Schools] Set Schools";
export const FETCH_SCHOOLS = "[Schools] Fetch Schools";
export const UPDATE_SCHOOL = "[School] Update School";
export const DELETE_SCHOOL = "[School] Delete School";
export const FIND_ONE_SCHOOL = "[School] Find One School";
export const AUTO_FETCH = "[School] Auto Fetch";
export const SET_SCHOOLSS = "[School] Set Schoolss";
export const SEARCH_COMPLETE = "[School] Search Complete";
export const SCHOOL_ERRORS = "[School] School Errors";
export const CLEAR_ERROR = "[School] Clear Errors";

export class SetSchools implements Action {
  readonly type = SET_SCHOOLS;

  constructor(public payload: School) {}
}

export class SetSchoolss implements Action {
  readonly type = SET_SCHOOLSS;
  constructor(public payload: School[]) {}
}

export class FetchSchools implements Action {
  readonly type = FETCH_SCHOOLS;
  constructor(
    public payload: {
      fieldName: string;
      fieldValue: string;
      pageNumber: number;
      limit: number;
      keyword: string;
      sortBy: string;
      sortOrder: number;
      // data: School[];
    }
  ) {}
}

export class UpdateSchool implements Action {
  readonly type = UPDATE_SCHOOL;

  constructor(
    public payload: {
      name: string;
      email: string;
      address: string;
      photo: string;
      zipCode: number;
      city: string;
      state: string;
      country: string;
      _id: string;
    }
  ) {}
}

export class DeleteSchool implements Action {
  readonly type = DELETE_SCHOOL;

  constructor(public payload: string) {}
}

export class FindOneSchool implements Action {
  readonly type = FIND_ONE_SCHOOL;

  constructor(public payload: string) {}
}

export class SearchComplete implements Action {
  readonly type = SEARCH_COMPLETE;

  constructor(public payload: School) {}
}

export class AutoFetch implements Action {
  readonly type = AUTO_FETCH;
}

export class SchoolErrors implements Action {
  readonly type = SCHOOL_ERRORS;

  constructor(public payload: string) {}
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export type SchoolActions =
  | SetSchools
  | FetchSchools
  | UpdateSchool
  | DeleteSchool
  | FindOneSchool
  | AutoFetch
  | SetSchoolss
  | SearchComplete
  | SchoolErrors
  | ClearError;
