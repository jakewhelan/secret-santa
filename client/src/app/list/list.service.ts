// reactive extensions
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
 
// imports
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// data models
import { User } from './models/user.model';
import { Name } from './models/name.model';

@Injectable()
export class ListService {

  private users: any[] = null;
  private typeCastUsers: User[] = null;
  private usersWithAssignment: User[] = null;

  constructor(
    private http: Http,
  ) {}

  /*
   *  @method getUsers
   *
   *  Get users any[] from REST
   *  API or local service cache.
   *
   *  If retrieved from REST API cache
   *  as this.users.
   */
  getUsers(forceHttpGet?: boolean): Observable<any[]> {
    const endpoint = "http://localhost:3000/api/users/";
    this.users = this.users || JSON.parse(localStorage.getItem("gilt.secret-santa.ListService.users"));
    if(this.users && !forceHttpGet) {
      console.info("ListService: (getUsersWithAssignment) getting cached any[]")
      return Observable.of(this.users);
    } else {
      console.info("ListService: (getUsers) get -> " + endpoint);
      return this.http
        .get(endpoint)
        .map(response => {
          let users = response.json().users;
          this.users = users;
          localStorage.setItem("gilt.secret-santa.ListService.users", JSON.stringify(users));
          return users;
        })
        .catch(error => {
          console.error(error);
          return Observable.of([]); // empty observable
        })
    }
  }

  /*
   *  @method castUsers
   *
   *  Type cast JSON data any[] to
   *  typescript Class: User[].
   *
   *  Cache User[] as this.typeCastUsers 
   *  User[].
   *
   *  Returns any[] type cast to User[]
   *  as Observable<User[]>.
   */
  castUsers(users: any[]): Observable<User[]> {
    let typeCastUsers: User[] = [];
    users.map(user => {
      let n: Name = new Name();
      let u: User = new User();
      Object.assign(n, user.name);
      user.name = n;
      Object.assign(u, user);
      typeCastUsers.push(u);
    });
    this.typeCastUsers = typeCastUsers;
    return Observable.of(typeCastUsers);
  }

  /*
   *  @method shuffleUsers
   *
   *  Durstendfeld implementation of
   *  the Fisher-Yates shuffle algorithm.
   *
   *  For each element of the User[] 
   *  select a random element and swap 
   *  it with the current element.
   *
   *  Returns shuffled User[] as
   *  Observable<User[]>.
   */ 
  shuffleUsers(users: User[]): Observable<User[]> {
    let array = users;
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return Observable.of(array)
  }

  /*
   *  @method assignUsers
   *
   *  Assign each user/santa with a recipient.
   *
   *  Elements are assigned to their neighbouring 
   *  element in shuffled user[] to prevent 
   *  self-assignment & mutual assignment.
   *
   *  Because elements are shuffled each time before
   *  this operation, the assignment will always
   *  be different.
   *
   *  Returns User[] with assignments as Observable<User[]>.
   */
  assignUsers(users: User[]): Observable<User[]> {
    let usersWithAssignment: User[];

    // clone and type cast object to prevent circular references
    this.castUsers(JSON.parse(JSON.stringify(users)))
      .first()
      .subscribe(users => usersWithAssignment = users);

    users.map(
        (user, index) => usersWithAssignment[index].assignment = (index != users.length - 1) ? users[index + 1] : users[0]
      );

    this.usersWithAssignment = usersWithAssignment;
    localStorage.setItem("gilt.secret-santa.ListService.usersWithAssignment", JSON.stringify(usersWithAssignment));
    return Observable.of(usersWithAssignment);
  }

  /*
   *  @method getUsersWithAssignment
   *
   *  1. Get user data from cache or REST api.
   *  2. Type cast data to User[].
   *  3. Shuffle User[].
   *  4. Assign a User to each User, secret santa
   *     recipient.
   */
  getUsersWithAssignment(): Observable<User[]> {  
      return this.getUsers()
        .flatMap(users => this.castUsers(users))
        .flatMap(users => this.shuffleUsers(users))
        .flatMap(users => this.assignUsers(users))
        //.map(users => { console.log(users); return users})
  }

  /*
   *  @method getCachedUsersWithAssignment
   *
   *  Returns users with secret santa 
   *  assignments from local service cache.
   */
  getCachedUsersWithAssignment(): Observable<User[]> {
    let _localStorage = {
      usersWithAssignment: JSON.parse(localStorage.getItem("gilt.secret-santa.ListService.usersWithAssignment"))
    }
    if(_localStorage.usersWithAssignment && !this.usersWithAssignment) {
      console.info("ListService: (getCachedUsersWithAssignment) cached JSON data found in localStorage");
      this.castUsers(JSON.parse(JSON.stringify(_localStorage.usersWithAssignment)))
        .first()
        .subscribe(users => this.usersWithAssignment = users);
    }
    if(this.usersWithAssignment) {
      console.info("ListService: (getCachedUsersWithAssignment) getting cached User[]");
      return Observable.of(this.usersWithAssignment);
    } else {
      console.error("ListService: (getCachedUsersWithAssignment) no cached User[] 'ListService.usersWithAssignment'")
      console.info("ListService: (getCachedUsersWithAssignment) getting User[] from 'ListService.getUsersWithAssignment'")
      return this.getUsersWithAssignment();
    }
  }

  /*
   *  @method getReassignedUsers
   *
   *  Reshuffle and re-assign user
   *  secret santa recipients.
   *
   *  Get User[] from local service 
   *  cache if available.
   */
  getReassignedUsers(): Observable<User[]> {
    if(this.typeCastUsers) {
      console.info("ListService: (getReassignedUsers) getting cached User[]");
      return this.shuffleUsers(this.typeCastUsers)
        .flatMap(users => this.assignUsers(users))
    } else {
      console.error("ListService: (getReshuffledUsers) no cached User[] 'ListService.typeCastUsers'")
      console.info("ListService: (getReshuffledUsers) getting User[] from 'ListService.getUsersWithAssignment'")
      return this.getUsersWithAssignment();
    }
  }

  /*
   *  @method getIndividualUserWithAssignment
   *
   *  Filter User[]
   */
  getIndividualUserWithAssignment(name: Name): Observable<User[]> {
    return this.getCachedUsersWithAssignment()
      .map(user => {
        return user
          .filter(user => {
            return user.name.first == name.first && user.name.last == name.last
          })
      });
  }

  filterUsersByName(users: User[], filterValues: string[], 
    logicalOperator: string): User[] {
     
    let filteredUsers: User[];

    filteredUsers = users.filter(user => {
      filterValues = filterValues.filter(value => value != "");
      let match: boolean[] = new Array(filterValues.length).fill(false); // create array & set default values

      /*
       *  For each filter value check
       *  for a match with either
       *  user.name.first or
       *  user.name.second.
       *
       *  Build an array of Booleans that
       *  narrate the outcome of this 
       *  operation.
       */
      for(let i = 0; i < filterValues.length; i++) {
        let filterValue: string = filterValues[i];
        let filterValueMatch: boolean = 
            (user.name.first.toLowerCase()
              .indexOf(filterValue.toLowerCase()) > -1) 
         || (user.name.last.toLowerCase()
              .indexOf(filterValue.toLowerCase()) > -1);
        if(filterValueMatch) {
          match[i] = true;
        }
      }

      /*
       *  Apply logical AND or
       *  logical OR to boolean[]
       *
       *  Return the outcome
       */
      switch(logicalOperator) {
        case "OR":
          for(let i = 0; i < match.length; i++) {
            if(match[i] == true) return true;
          }
          return false;
        case "AND":
          for(let i = 0; i < match.length; i++) {
            if(!match[i]) return false;
          }
          return true;
      }
      
    });

    return filteredUsers;
  }

}
