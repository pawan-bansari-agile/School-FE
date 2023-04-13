import { ActionReducerMap } from "@ngrx/store";

import * as fromShoppingList from "../shopping-list/store/shopping-list.reducer";
import * as fromAuth from "../auth/store/auth.reducer";
// import * as fromSchoolAuth from "../school-auth/school-auth/store/schoolAuth.reducer";
import * as fromRecipes from "../recipes/store/recipe.reducer";

export interface AppState {
  shoppingList: fromShoppingList.State;
  auth: fromAuth.State;
  // schoolAuth: fromSchoolAuth.State;
  recipes: fromRecipes.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer,
  // schoolAuth: fromSchoolAuth.authReducer,
  recipes: fromRecipes.recipeReducer,
};
