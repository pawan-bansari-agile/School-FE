import { Action } from '@ngrx/store';

import { School } from '../../auth/school.model';

export const SET_SCHOOLS = '[Schools] Set Schools';
export const FETCH_SCHOOLS = '[Schools] Fetch Schools';
// export const ADD_RECIPE = "[Recipe] Add Recipe";
export const UPDATE_SCHOOL = '[School] Update School';
export const DELETE_SCHOOL = '[School] Delete School';
export const FIND_ONE_SCHOOL = '[School] Find One School';
export const AUTO_FETCH = '[School] Auto Fetch';
export const SET_SCHOOLSS = '[School] Set Schoolss';
// export const STORE_RECIPES = "[Recipe] Store Recipes";

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
  constructor(public payload: School[]) {}
}

// export c`lass AddRecipe implements Action {
//   readonly type = ADD_RECIPE;

//   constructor(public payload: Recipe) {}
// }`

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
    },
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

export class AutoFetch implements Action {
  readonly type = AUTO_FETCH;
}

// export class StoreRecipes implements Action {
//   readonly type = STORE_RECIPES;
// }

export type SchoolActions =
  | SetSchools
  | FetchSchools
  // | AddRecipe
  | UpdateSchool
  | DeleteSchool
  | FindOneSchool
  | AutoFetch
  | SetSchoolss;
// | StoreRecipes;
