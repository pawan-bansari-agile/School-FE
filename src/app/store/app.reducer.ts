import { ActionReducerMap } from "@ngrx/store";

import * as fromAuth from "../auth/store/auth.reducer";
import * as fromSchools from "../schools/store/school.reducer";
import * as fromStudents from "../students/store/student.reducer";

export interface AppState {
  auth: fromAuth.State;
  schools: fromSchools.State;
  students: fromStudents.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  schools: fromSchools.schoolReducer,
  students: fromStudents.studentReducer,
};
