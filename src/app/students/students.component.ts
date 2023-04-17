import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import * as fromApp from "../store/app.reducer";
import { Student } from "./student.model";
import * as StudentActions from "./store/student.actions";
import { NgForm } from "@angular/forms";

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
    private store: Store<fromApp.AppState>
  ) {}

  students$: Observable<Student[]>;

  students: Student[] = [];

  selectedStudent$: Student | null = null;

  selectedStudent: Subscription;

  @Output() studSelectionChange = new EventEmitter<Student>();

  searchedStudent: Student | null = null;

  ngOnInit() {
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
}
