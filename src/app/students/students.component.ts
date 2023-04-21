import { HttpClient } from "@angular/common/http";
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ComponentFactoryResolver,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import * as fromApp from "../store/app.reducer";
import { Student } from "./student.model";
import * as StudentActions from "./store/student.actions";
import { NgForm } from "@angular/forms";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { AlertComponent } from "../shared/alert/alert.component";

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
    private store: Store<fromApp.AppState>,
    private componentFactoryResolver: ComponentFactoryResolver
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

  private closeSub: Subscription;

  error: string = null;

  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  ngOnInit() {
    this.userSub = this.store.select("auth").subscribe((authState) => {
      this.userRole = authState.school ? authState.school.role : "";
      if (authState.user) {
        this.userRole = authState.user.role;
      }
    });

    this.studentsSub = this.store
      .select("students")

      .subscribe((studentState) => {
        this.error = studentState.studentError;
        if (this.error) {
          this.showErrorAlert(this.error);
        }
        this.students$ = studentState.students;
      });
  }

  onHandleError() {
    this.store.dispatch(new StudentActions.ClearError());
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      hostViewContainerRef.clear();
      this.closeSub.unsubscribe();
      this.error = null;
    });
  }

  fetchStudents(form: NgForm) {
    let filterParams;
    if (!form) {
      filterParams = {
        fieldName: "",
        fieldValue: "",
        pageNumber: "",
        limit: "",
        keyword: "",
        sortBy: "",
        sortOrder: "",
      };
    } else {
      filterParams = {
        fieldName: form.value.fieldName || "",
        fieldValue: form.value.fieldValue || "",
        pageNumber: form.value.pageNumber || "",
        limit: form.value.limit ? form.value.limit.toString() : "",
        keyword: form.value.keyword || "",
        sortBy: form.value.sortBy || "",
        sortOrder: form.value.sortOrder || "",
      };
    }

    this.store.dispatch(new StudentActions.FetchStudents(filterParams));
    this.onFilter = false;
  }

  selectSchool(student: Student): void {
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
    this.fetchStudents(form);
    this.createStud = false;
  }

  onFilters() {
    this.onFilter = !this.onFilter;
  }
}
