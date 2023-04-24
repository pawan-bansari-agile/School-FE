import {
  Component,
  Input,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { School } from "src/app/auth/school.model";
import * as fromApp from "../../store/app.reducer";
import * as SchoolActions from "../store/school.actions";
import { AlertComponent } from "src/app/shared/alert/alert.component";
import { PlaceholderDirective } from "src/app/shared/placeholder/placeholder.directive";

@Component({
  selector: "app-school-item",
  templateUrl: "./school-item.component.html",
  styleUrls: ["./school-item.component.css"],
})
export class SchoolItemComponent implements OnInit {
  roleSub: Subscription;
  role: string = "";
  schoolId: string = "";
  school: School | null = null;
  @Input() selectedSchool: School | null = null;

  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;
  error: string = null;

  private closeSub: Subscription;

  file: File;
  imageUrl: string;

  constructor(
    private store: Store<fromApp.AppState>,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

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

    this.store.select("schools").subscribe((schoolState) => {
      this.error = schoolState.schoolError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onSubmit(form: NgForm) {
    const name = form.value.name;
    const address = form.value.address;
    const photo = form.value.photo;
    const zipCode = form.value.zipCode.toString();
    const city = form.value.city;
    const state = form.value.state;
    const country = form.value.country;
    const email = form.value.email;
    const _id = form.value._id;

    const payload = {
      name: name,
      address: address,
      file: this.file,
      zipCode: zipCode,
      city: city,
      state: state,
      country: country,
      email: email,
      _id: _id,
    };

    this.store.dispatch(new SchoolActions.UpdateSchool(payload));
    location.reload();
  }

  getFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      console.log("from get file method", this.file);
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
    }
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  onHandleError() {
    this.store.dispatch(new SchoolActions.ClearError());
  }
}
