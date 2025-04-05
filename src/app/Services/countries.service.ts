import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_COUNTRIES } from '../GraphQL/Queries/countries.query';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(private apollo: Apollo) { }

  getCountries(limit: number, username: string): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_COUNTRIES,
      variables: {
        limit,
        username,
      },
    }).valueChanges;
  }
}
