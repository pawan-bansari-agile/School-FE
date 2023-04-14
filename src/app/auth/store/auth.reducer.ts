import { School } from "src/app/auth/school.model";
import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
  user: User;
  school: School;
  authError: string;
  loading: boolean;
  schools: School[];
}

const initialState: State = {
  user: null,
  school: null,
  authError: null,
  loading: false,
  schools: null,
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = new User(
        action.payload.data.access_token,
        action.payload.data.user.userName,
        action.payload.data.user.email,
        action.payload.data.user.role,
        action.payload.data.user.forgetPwdToken,
        action.payload.data.user.forgetPwdExpires,
        action.payload.data.user.deleted,
        action.payload.data.user._id,
        action.payload.data.user.__v,
        action.payload.message
      );
      return {
        ...state,
        authError: null,
        user: user,
        loading: false,
      };
    case AuthActions.SCHOOL_AUTHENTICATE_SUCCESS:
      const school = new School(
        action.payload.data.access_token,
        action.payload.data.user.name,
        action.payload.data.user.email,
        action.payload.data.user.address,
        action.payload.data.user.photo,
        action.payload.data.user.zipCode,
        action.payload.data.user.city,
        action.payload.data.user.state,
        action.payload.data.user.country,
        action.payload.data.user.role,
        action.payload.data.user.forgetPwdToken,
        action.payload.data.user.forgetPwdExpires,
        action.payload.data.user.deleted,
        action.payload.data.user._id,
        action.payload.data.user.__v,
        action.payload.message
      );
      return {
        ...state,
        authError: null,
        user: null,
        school: school,
        loading: false,
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    case AuthActions.SCHOOL_LOGOUT:
      return {
        ...state,
        school: null,
      };
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true,
      };
    case AuthActions.SCHOOL_LOGIN_START:
    case AuthActions.SCHOOL_SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true,
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false,
      };
    case AuthActions.SCHOOL_AUTHENTICATE_FAIL:
      return {
        ...state,
        school: null,
        authError: action.payload,
        loading: false,
      };
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null,
      };
    case AuthActions.SCHOOL_CLEAR_ERROR:
      return {
        ...state,
        authError: null,
      };
    default:
      return state;
  }
}
