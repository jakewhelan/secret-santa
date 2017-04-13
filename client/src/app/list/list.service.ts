import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class ListService {

  constructor(
    private http: Http,
  ) { }

  getUsers(): Observable<any> {
    //return Observable.of()

    const endpoint = "http://localhost:3000/api/users/";

    return this.http
      .get(endpoint)
      .map(
        response => {
          console.log(response)
        },
        error => {
          console.log(error);
        }
      );

  }

}
