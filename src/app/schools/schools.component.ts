import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { School } from '../auth/school.model'; // Assuming you have a School model defined
import * as fromApp from '../store/app.reducer';
import * as SchoolActions from './store/school.actions';

export interface schoolResponse {
  data: [];
  message: string;
}

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.css'],
})
export class SchoolsComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
  ) {}

  // private roleSub: Subscription;

  schools$: Observable<School[]>;

  schools: School[] = [];

  selectedSchool$: School | null = null;

  selectedSchool: Subscription;

  role: string = '';
  schoolId: string = '';

  ngOnInit() {
    this.schools$ = this.http
      .get<schoolResponse>('http://localhost:3000/school/findAll')
      .pipe(
        map((res) => {
          console.log('res', res.data);
          this.schools = res.data;
          console.log('this.schools from school component', this.schools);
          new SchoolActions.SetSchoolss(res.data);
          return res.data;
        }),
      );
    // this.roleSub = this.store
    //   .select('auth')
    //   .pipe(
    //     map((authState) => {
    //       console.log('authstate', authState.user);

    //       authState.user ? (this.role = authState.user.role) : '';
    //       authState.school ? (this.schoolId = authState.school._id) : '';
    //       // return this.role;
    //     }),
    //   )
    //   .subscribe();
  }

  // ngOnDestroy(): void {
  //   this.roleSub.unsubscribe();
  // }

  selectSchool(school: School): void {
    this.store.dispatch(new SchoolActions.SetSchools(school));
    this.selectedSchool$ = JSON.parse(localStorage.getItem('selectedSchool'));
    // this.store
    //   .select('schools')
    //   .pipe(
    //     map((schoolState) => {
    //       return schoolState.school;
    //     }),
    //   )
    //   .subscribe((school) => {
    //     this.selectedSchool$ = school;
    //   });
    console.log('selectedSchool$', this.selectedSchool$);
  }
}
