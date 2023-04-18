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

  students$: Student[];

  students: Student[] = [];

  selectedStudent$: Student | null = null;

  selectedStudent: Subscription;

  userSub: Subscription;

  studentsSub: Subscription;

  userRole: string;

  @Output() studSelectionChange = new EventEmitter<Student>();

  searchedStudent: Student | null = null;

  createStud: boolean;

  onFilter: boolean = false;

  ngOnInit() {
    this.userSub = this.store
      .select("auth")
      .pipe(
        map((authState) => {
          this.userRole = authState.school ? authState.school.role : "";
          if (authState.user) {
            this.userRole = authState.user.role;
          }
        })
      )
      .subscribe();

    this.store.dispatch(
      new StudentActions.FetchStudents({
        fieldName: "",
        fieldValue: "",
        pageNumber: "",
        limit: "",
        keyword: "",
        sortBy: "",
        sortOrder: "",
      })
    );

    this.studentsSub = this.store
      .select("students")
      .pipe(
        map((studentState) => {
          console.log(
            "students from oninit in component",
            studentState.students
          );

          this.students$ = studentState.students;
        })
      )
      .subscribe();

    // this.http
    //   .get<studentResponse>("http://localhost:3000/students/findAll")
    //   .pipe(
    //     map((res) => {
    //       this.students = res.data;
    //       new StudentActions.SetStudentss(res.data);
    //       return res.data;
    //     })
    //   );
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

  onFilters() {
    this.onFilter = !this.onFilter;
  }

  onFilterSelected(form: NgForm) {
    console.log("selections from onFilterSelected", form.value);
    this.store.dispatch(
      new StudentActions.FetchStudents({
        fieldName: form.value.fieldName ? form.value.fieldName : "",
        fieldValue: form.value.fieldValue ? form.value.fieldValue : "",
        pageNumber: form.value.pageNumber ? form.value.pageNumber : "",
        limit: form.value.limit ? form.value.limit : "",
        keyword: form.value.keyword ? form.value.keyword : "",
        sortBy: form.value.sortBy ? form.value.sortBy : "",
        sortOrder: form.value.sortOrder ? form.value.sortOrder : "",
      })
    );
  }
}
