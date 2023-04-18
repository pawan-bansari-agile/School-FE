import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";

const appRoutes: Routes = [
  { path: "", redirectTo: "/auth", pathMatch: "full" },
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
  {
    path: "students",
    loadChildren: "./students/students.module#StudentsModule",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
