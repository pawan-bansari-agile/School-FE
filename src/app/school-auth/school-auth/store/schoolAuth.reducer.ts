import { School } from "../school.model";
import * as SchoolAuthActions from "./schoolAuth.actions";

export interface State {
  user: School;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};

export function authReducer(
  state = initialState,
  action: SchoolAuthActions.AuthActions
) {
  switch (action.type) {
    case SchoolAuthActions.AUTHENTICATE_SUCCESS:
      const user = new School(
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
        user: user,
        loading: false,
      };
    case SchoolAuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    case SchoolAuthActions.LOGIN_START:
    case SchoolAuthActions.SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true,
      };
    case SchoolAuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false,
      };
    case SchoolAuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null,
      };
    default:
      return state;
  }
}
