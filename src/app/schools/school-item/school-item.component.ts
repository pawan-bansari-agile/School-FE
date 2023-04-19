import { Component, Input, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { School } from "src/app/auth/school.model";
import * as fromApp from "../../store/app.reducer";
import * as SchoolActions from "../store/school.actions";

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
      photo: photo,
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
}
