import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface countResponse {
  data: {
    count: number;
  };
  message: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private http: HttpClient) {}
  count: Observable<number>;
  dashboard: FormGroup;

  ngOnInit() {
    this.count = this.http
      .get<countResponse>('http://localhost:3000/students/totalCount')
      .pipe(
        map((res) => {
          // console.log("res", res.data.count);
          if (!res.data) {
            return 0;
          }
          return res.data.count;
        }),
      );
    // .subscribe((res) => {
    //   console.log("res", res.data);
    //   return res.data;
    // });

    // this.count = total;
  }

  onSubmit(dashboardForm: FormGroup) {
    let searchParams = new HttpParams();

    console.log(dashboardForm.value);

    const std = dashboardForm.value.standard;

    console.log('std', std);

    const school = dashboardForm.value.school;

    console.log('school', school);

    searchParams = searchParams.append('std', std);
    searchParams = searchParams.append('school', school);

    const totalCount = this.http
      .get<countResponse>('http://localhost:3000/students/totalCount', {
        params: searchParams,
      })
      .pipe(
        map((res) => {
          console.log('res', res);
          if (!res.data) {
            return 0;
          }
          return res.data.count;
        }),
      );

    console.log('totalCount', totalCount);

    this.count = totalCount;
  }
}
