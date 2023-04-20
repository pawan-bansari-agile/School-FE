import { Component, Input, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Student } from "../student.model";
import * as fromApp from "../../store/app.reducer";
import { map } from "rxjs/operators";
import { NgForm } from "@angular/forms";
import * as StudentActions from "../store/student.actions";

@Component({
  selector: "app-student-item",
  templateUrl: "./student-item.component.html",
  styleUrls: ["./student-item.component.css"],
})
export class StudentItemComponent implements OnInit {
  roleSub: Subscription;
  role: string = "";
  schoolId: string = "";
  student: Student | null = null;
  @Input() selectedStudent: Student | null = null;
  // @Input() status: boolean;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.roleSub = this.store
      .select("auth")
      .pipe(
        map((authState) => {
          authState.user ? (this.role = authState.user.role) : "";
          authState.school ? (this.schoolId = authState.school._id) : "";
        })
      )
      .subscribe();
  }

  onSubmit(form: NgForm) {
    const name = form.value.name;
    const parentNumber = form.value.parentNumber;
    const address = form.value.address;
    const std = form.value.std;
    const photo = form.value.photo;
    const dob = form.value.dob;
    const status = form.value.status;
    const _id = this.selectedStudent._id;

    const payload = {
      name: name,
      address: address,
      photo: photo,
      parentNumber: parentNumber,
      std: std,
      dob: dob,
      status: status,
      _id: _id,
    };

    this.store.dispatch(new StudentActions.UpdateStudent(payload));
    // this.store.dispatch(
    //   new StudentActions.FetchStudents({
    //     fieldName: "",
    //     fieldValue: "",
    //     pageNumber: "",
    //     limit: "",
    //     sortBy: "",
    //     sortOrder: "",
    //     keyword: "",
    //   })
    // );
    location.reload();
  }

  onDelete(student) {
    this.store.dispatch(new StudentActions.DeleteStudent(student._id));
    location.reload();
  }

  changeStatus(student: Student) {
    console.log("student details from status update", student);
    const payload = {
      id: student._id,
      status: student.status,
    };

    this.store.dispatch(new StudentActions.StatusUpdate(payload));
    // this.status = this.status;
    location.reload();
  }
}
