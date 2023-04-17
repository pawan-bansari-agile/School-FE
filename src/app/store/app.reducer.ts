import { ActionReducerMap } from "@ngrx/store";

import * as fromAuth from "../auth/store/auth.reducer";
// import * as fromSchoolAuth from "../school-auth/school-auth/store/schoolAuth.reducer";
import * as fromSchools from "../schools/store/school.reducer";
import * as fromStudents from "../students/store/student.reducer";

export interface AppState {
  auth: fromAuth.State;
  // schoolAuth: fromSchoolAuth.State;
  schools: fromSchools.State;
  students: fromStudents.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  // schoolAuth: fromSchoolAuth.authReducer,
  schools: fromSchools.schoolReducer,
  students: fromStudents.studentReducer,
};
