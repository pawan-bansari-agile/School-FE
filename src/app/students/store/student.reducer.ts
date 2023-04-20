// import { School, UpdatedSchool } from "../../auth/school.model";
import { UpdatedSchool } from "src/app/auth/school.model";
import { Student } from "../student.model";
import * as StudentActions from "./student.actions";

export interface State {
  students: Student[];
  student: Student;
  updatedSchool: UpdatedSchool;
  searchedStudent: Student;
  newStudent: Student;
}

const initialState: State = {
  students: [],
  student: null,
  updatedSchool: null,
  searchedStudent: null,
  newStudent: null,
};

export function studentReducer(
  state = initialState,
  action: StudentActions.StudentActions
) {
  switch (action.type) {
    case StudentActions.SET_STUDENTS:
      return {
        ...state,
        student: action.payload,
      };
    case StudentActions.SET_STUDENTSS:
      return {
        ...state,
        students: [...action.payload],
      };
    case StudentActions.FETCH_STUDENTS:
      return {
        ...state,
      };
    case StudentActions.FILTER_STUDENTS:
      return {
        ...state,
      };
    case StudentActions.ADD_STUDENT:
      return {
        ...state,
        newSchool: action.payload,
      };
    case StudentActions.UPDATE_STUDENT:
      const updatedStudent = {
        ...action.payload,
      };
      return {
        ...state,
        updatedStudent: updatedStudent,
      };
    case StudentActions.STATUS_UPDATE:
      return {
        ...state,
      };
    case StudentActions.DELETE_STUDENT:
      return {
        ...state,
      };
    case StudentActions.FIND_ONE_STUDENT:
      return {
        ...state,
      };
    case StudentActions.SEARCH_COMPLETE:
      const existingStudent = {
        ...action.payload,
      };
      return {
        ...state,
        searchedStudent: existingStudent,
      };
    case StudentActions.AUTO_FETCH:
      return {
        ...state,
        student: state.student,
      };
    default:
      return state;
  }
}
