import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = "Login as User";
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.storeSub = this.store.select("auth").subscribe((authState) => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onSwitchMode(feature: string) {
    this.isLoginMode = `SignUp as ${feature}`;
  }

  onLoginMode(feature: string) {
    this.isLoginMode = `Login as ${feature}`;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const name = form.value.name;
    const address = form.value.address;
    const photo = form.value.photo;
    const zipCode = form.value.zipCode;
    const city = form.value.city;
    const state = form.value.state;
    const country = form.value.country;
    const userName = form.value.userName;
    const email = form.value.email;
    const password = form.value.password;
    const role = form.value.role;

    switch (this.isLoginMode) {
      case "Login as User":
        this.store.dispatch(
          new AuthActions.LoginStart({ email: email, password: password })
        );
        break;
      case "Login as School":
        this.store.dispatch(
          new AuthActions.SchoolLoginStart({
            email: email,
            password: password,
          })
        );
        break;
      case "SignUp as User":
        this.store.dispatch(
          new AuthActions.SignupStart({
            userName: userName,
            email: email,
            role: role,
          })
        );
        break;
      case "SignUp as School":
        this.store.dispatch(
          new AuthActions.SchoolSignupStart({
            name: name,
            email: email,
            address: address,
            photo: photo,
            zipCode: zipCode,
            city: city,
            state: state,
            country: country,
          })
        );
    }

    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
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
}
