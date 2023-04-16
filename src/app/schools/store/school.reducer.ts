import { School, UpdatedSchool } from '../../auth/school.model';
import * as SchoolActions from './school.actions';

export interface State {
  schools: School[];
  school: School;
  updatedSchool: UpdatedSchool;
}

const initialState: State = {
  schools: [],
  school: null,
  updatedSchool: null,
};

export function schoolReducer(
  state = initialState,
  action: SchoolActions.SchoolActions,
) {
  switch (action.type) {
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
    // case SchoolActions.ADD_RECIPE:
    //   return {
    //     ...state,
    //     recipes: [...state.recipes, action.payload],
    //   };
    case SchoolActions.UPDATE_SCHOOL:
      const updatedSchool = {
        ...action.payload,
      };

      // const updatedSchools = [...state.schools];
      // updatedSchools[action.payload.index] = updatedSchool;

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
        schools: state.schools.filter((school) => {
          return school._id === action.payload;
        }),
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
