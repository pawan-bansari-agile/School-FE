import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SchoolsComponent } from "./schools.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [SchoolsComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: "", component: SchoolsComponent }]),
    SharedModule,
  ],
})
export class SchoolsModule {}
