import { School, UpdatedSchool } from "../../auth/school.model";
import * as SchoolActions from "./school.actions";

export interface State {
  schools: School[];
  school: School;
  searchedSchool: School;
  schoolError: string;
}

const initialState: State = {
  schools: [],
  school: null,
  searchedSchool: null,
  schoolError: null,
};

export function schoolReducer(
  state = initialState,
  action: SchoolActions.SchoolActions
) {
  switch (action.type) {
    case SchoolActions.FETCH_SCHOOLS:
      return {
        ...state,
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
      return {
        ...state,
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
    case SchoolActions.SCHOOL_ERRORS:
      return {
        ...state,
        school: null,
        schoolError: action.payload,
        loading: false,
      };
    case SchoolActions.CLEAR_ERROR:
      return {
        ...state,
        schoolError: null,
      };
    default:
      return state;
  }
}
