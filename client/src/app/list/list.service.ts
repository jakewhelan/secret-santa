import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { User } from './models/user.model';

@Injectable()
export class ListService {

  constructor(
    private http: Http,
  ) { }

  getUsers(): Observable<User[]> {

    const endpoint = "http://localhost:3000/api/users/";

    return this.http
      .get(endpoint)
      .map(
        response => {
          return <User[]>response.json().users;
        },
        error => {
          console.log(error.json().error || "500 internal server error");
        }
      )
      .catch(error => { 
        return Observable.of(error);
      }

      )

  }

}
