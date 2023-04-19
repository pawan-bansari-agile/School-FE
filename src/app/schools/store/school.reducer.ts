import { School, UpdatedSchool } from "../../auth/school.model";
import * as SchoolActions from "./school.actions";

export interface State {
  schools: School[];
  school: School;
  updatedSchool: UpdatedSchool;
  searchedSchool: School;
}

const initialState: State = {
  schools: [],
  school: null,
  updatedSchool: null,
  searchedSchool: null,
};

export function schoolReducer(
  state = initialState,
  action: SchoolActions.SchoolActions
) {
  switch (action.type) {
    case SchoolActions.FETCH_SCHOOLS:
      return {
        ...state,
        // schools: action.payload.data,
      };
    case SchoolActions.SET_SCHOOLS:
      return {
        ...state,
        school: action.payload,
      };
    case SchoolActions.SET_SCHOOLSS:
      return {
        ...state,
        schools: [...action.payload],
      };
    case SchoolActions.UPDATE_SCHOOL:
      const updatedSchool = {
        ...action.payload,
      };

      return {
        ...state,
        updatedSchool: updatedSchool,
      };
    case SchoolActions.DELETE_SCHOOL:
      return {
        ...state,
        schools: state.schools.filter((school, index) => {
          return school._id !== action.payload;
        }),
      };
    case SchoolActions.FIND_ONE_SCHOOL:
      return {
        ...state,
      };
    case SchoolActions.SEARCH_COMPLETE:
      const existingSchool = {
        ...action.payload,
      };

      return {
        ...state,
        searchedSchool: existingSchool,
      };
    case SchoolActions.AUTO_FETCH:
      return {
        ...state,
        school: state.school,
      };
    default:
      return state;
  }
}
