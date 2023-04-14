import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";

const appRoutes: Routes = [
  { path: "", redirectTo: "/schools", pathMatch: "full" },
  { path: "recipes", loadChildren: "./recipes/recipes.module#RecipesModule" },
  {
    path: "shopping-list",
    loadChildren: "./shopping-list/shopping-list.module#ShoppingListModule",
  },
  {
    path: "auth",
    loadChildren: "./auth/auth.module#AuthModule",
  },
  {
    path: "dashboard",
    loadChildren: "./dashboard/dashboard.module#DashboardModule",
  },
  {
    path: "schools",
    loadChildren: "./schools/schools.module#SchoolsModule",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
