import { School } from "../../auth/school.model";
import * as SchoolActions from "./school.actions";

export interface State {
  schools: School[];
}

const initialState: State = {
  schools: [],
};

export function schoolReducer(
  state = initialState,
  action: SchoolActions.SchoolActions
) {
  switch (action.type) {
    case SchoolActions.SET_SCHOOLS:
      return {
        ...state,
        schools: [...action.payload],
      };
    // case SchoolActions.ADD_RECIPE:
    //   return {
    //     ...state,
    //     recipes: [...state.recipes, action.payload],
    //   };
    case SchoolActions.UPDATE_SCHOOL:
      const updatedSchool = {
        ...state.schools[action.payload.index],
        ...action.payload.newSchool,
      };

      const updatedSchools = [...state.schools];
      updatedSchools[action.payload.index] = updatedSchool;

      return {
        ...state,
        schools: updatedSchools,
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
        schools:
      }
    default:
      return state;
  }
}
