import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

export interface countResponse {
  data: {
    count: number;
  };
  message: string;
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  constructor(private http: HttpClient) {}
  count: Observable<number>;
  dashboard: FormGroup;

  ngOnInit() {
    this.count = this.http
      .get<countResponse>("http://localhost:3000/students/totalCount")
      .pipe(
        map((res) => {
          if (!res.data) {
            return 0;
          }
          return res.data.count;
        })
      );
  }

  onSubmit(dashboardForm: FormGroup) {
    let searchParams = new HttpParams();

    const std = dashboardForm.value.standard;

    const school = dashboardForm.value.school;

    searchParams = searchParams.append("std", std);
    searchParams = searchParams.append("school", school);

    const totalCount = this.http
      .get<countResponse>("http://localhost:3000/students/totalCount", {
        params: searchParams,
      })
      .pipe(
        map((res) => {
          if (!res.data) {
            return 0;
          }
          return res.data.count;
        })
      );

    this.count = totalCount;
  }
}
