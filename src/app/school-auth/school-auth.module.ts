import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { SharedModule } from "../shared/shared.module";
import { SchoolAuthComponent } from "./school-auth/school-auth.component";

@NgModule({
  declarations: [SchoolAuthComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: "", component: SchoolAuthComponent }]),
    SharedModule,
  ],
})
export class SchoolAuth {}
