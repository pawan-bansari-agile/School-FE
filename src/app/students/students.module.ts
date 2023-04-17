import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { StudentsComponent } from "./students.component";
import { SharedModule } from "../shared/shared.module";
// import { SchoolItemComponent } from "./school-item/school-item.component";
import { StudentItemComponent } from "./student-item/student-item.component";

@NgModule({
  declarations: [StudentsComponent, StudentItemComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: "", component: StudentsComponent }]),
    SharedModule,
    FormsModule,
  ],
})
export class StudentsModule {}
