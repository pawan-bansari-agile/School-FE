import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SchoolsComponent } from "./schools.component";
import { SharedModule } from "../shared/shared.module";
import { SchoolItemComponent } from "./school-item/school-item.component";

@NgModule({
  declarations: [SchoolsComponent, SchoolItemComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: "", component: SchoolsComponent }]),
    SharedModule,
    FormsModule,
  ],
})
export class SchoolsModule {}
