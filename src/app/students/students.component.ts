import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import * as fromApp from "../store/app.reducer";
import { Student } from "./student.model";
import * as StudentActions from "./store/student.actions";
import { NgForm } from "@angular/forms";
// import { Router } from "@angular/router";

export interface studentResponse {
  data: [];
  message: string;
}

@Component({
  selector: "app-students",
  templateUrl: "./students.component.html",
  styleUrls: ["./students.component.css"],
})
export class StudentsComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState> // private router: Router
  ) {}

  students$: Observable<Student[]>;

  students: Student[] = [];

  selectedStudent$: Student | null = null;

  selectedStudent: Subscription;

  userSub: Subscription;

  userRole: string;

  @Output() studSelectionChange = new EventEmitter<Student>();

  searchedStudent: Student | null = null;

  createStud: boolean;

  ngOnInit() {
    this.userSub = this.store
      .select("auth")
      .pipe(
        map((authState) => {
          this.userRole = authState.school ? authState.school.role : "";
        })
      )
      .subscribe();

    this.students$ = this.http
      .get<studentResponse>("http://localhost:3000/students/findAll")
      .pipe(
        map((res) => {
          this.students = res.data;
          new StudentActions.SetStudentss(res.data);
          return res.data;
        })
      );
  }

  selectSchool(student: Student): void {
    this.store.dispatch(new StudentActions.SetStudents(student));
    this.selectedStudent$ = student;
    this.studSelectionChange.emit(student);
  }

  onSearch(form: NgForm) {
    const id = form.value.search;
    if (id == "") {
      return;
    }
    this.store.dispatch(new StudentActions.FindOneStudent(id));
    this.store
      .select("students")
      .pipe(
        map((studentState) => {
          return studentState.searchedStudent;
        })
      )
      .subscribe((searchedStudent) => {
        this.searchedStudent = searchedStudent;
      });
  }

  onNewStudent() {
    this.createStud = true;
  }

  onCancel() {
    this.createStud = false;
  }

  onSubmit(form: NgForm) {
    const payload = {
      name: form.value.name,
      parentNumber: form.value.parentNumber.toString(),
      address: form.value.address,
      std: form.value.std,
      dob: form.value.dob,
    };
    this.store.dispatch(new StudentActions.AddStudent(payload));
    location.reload();
  }
}
