import { Component, Input, Output, EventEmitter } from "@angular/core";
import * as fromApp from "../../store/app.reducer";
import * as SchoolActions from "../../schools/store/school.actions";

import { Store } from "@ngrx/store";

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.css"],
})
export class AlertComponent {
  @Input() message: string;
  @Output() close = new EventEmitter<void>();

  constructor(private store: Store<fromApp.AppState>) {}

  onClose() {
    this.close.emit();
    this.store.dispatch(new SchoolActions.ClearError());
  }
}
