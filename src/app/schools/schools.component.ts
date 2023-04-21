import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ComponentFactoryResolver,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { School } from "../auth/school.model";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import * as fromApp from "../store/app.reducer";
import * as SchoolActions from "./store/school.actions";

export interface schoolResponse {
  data: [];
  message: string;
}

@Component({
  selector: "app-schools",
  templateUrl: "./schools.component.html",
  styleUrls: ["./schools.component.css"],
})
export class SchoolsComponent implements OnInit {
  constructor(
    private store: Store<fromApp.AppState>,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}
  schools$: School[];
  schools: School[] = [];
  selectedSchool$: School | null = null;
  selectedSchool: Subscription;
  schoolsSub: Subscription;
  @Output() selectionChange = new EventEmitter<School>();
  searchedSchool: School | null = null;
  onFilter: boolean = false;
  role: string = "";
  schoolId: string = "";
  private closeSub: Subscription;
  error: string = null;

  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  ngOnInit() {
    this.schoolsSub = this.store.select("schools").subscribe((schoolState) => {
      this.error = schoolState.schoolError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
      this.schools$ = schoolState.schools;
    });
  }

  onHandleError() {
    this.store.dispatch(new SchoolActions.ClearError());
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

  fetchSchools(form: NgForm) {
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
        sortOrder: +form.value.sortOrder || "",
      };
    }

    this.store.dispatch(new SchoolActions.FetchSchools(filterParams));
    this.onFilter = false;
  }

  selectSchool(school: School): void {
    this.selectedSchool$ = school;
    this.selectionChange.emit(school);
  }

  onSearch(form: NgForm) {
    const id = form.value.search;

    if (id == "") {
      return;
    }
    this.store.dispatch(new SchoolActions.FindOneSchool(id));
    this.store
      .select("schools")
      .pipe(
        map((schoolState) => {
          return schoolState.searchedSchool;
        })
      )
      .subscribe((searchedSchool) => {
        this.searchedSchool = searchedSchool;
      });
  }

  onFilters() {
    this.onFilter = !this.onFilter;
  }
}
