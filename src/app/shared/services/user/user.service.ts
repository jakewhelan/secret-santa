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
import { User } from '../../models/user.model';
import { Name } from '../../models/name.model';

@Injectable()
export class UserService {

  constructor(
    private http: Http,
  ) {}

  /*
   *  @method getUsers
   *
   *  Get users any[] from REST
   *  API or localStorage cache.
   *
   *  If retrieved from REST API cache
   *  any[] in localStorage.
   *
   *  Return any[] as Observable<any[]>.
   */
  getUsers(forceHttpGet?: boolean): Observable<any[]> {
    const endpoint = "http://localhost:3000/api/users/";
    let users = JSON.parse(localStorage.getItem("gilt.secret-santa.UserService.users"));
    if(users && !forceHttpGet) {
      console.info("UserService: (getUsersWithAssignment) getting cached any[]")
      return Observable.of(users);
    } else {
      console.info("UserService: (getUsers) GET -> " + endpoint);
      return this.http
        .get(endpoint)
        .map(response => {
          let users = response.json().users || [];
          if(users.length == 0) {
            console.error("UserService: (assignUsers) provided any[] has no elements");
            return [];
          } else {
            localStorage.setItem("gilt.secret-santa.UserService.users", JSON.stringify(users));
            return users;
          }
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
   *  User[].
   *
   *  Clone User[] to prevent circular
   *  Object references. Type cast
   *  any[] 2 levels deep to support
   *  user.assignment: Object & 
   *  user.assignment.name: Object.
   *  Build new array of type cast User
   *  elements.
   *
   *  Return User[] as Observable<User[]>.
   */
  castUsers(users: any[]): Observable<User[]> {
    users = JSON.parse(JSON.stringify(users));
    let typeCastUsers: User[] = [];
    users.map(user => {
      let u: User = new User();
      let un: Name = new Name();
      let a: User = new User();
      let an: Name = new Name();
      if(user.assignment) {
        Object.assign(an, user.assignment.name);
        user.assignment.name = an;
        Object.assign(a, user.assignment);
        user.assignment = a;
      }
      Object.assign(un, user.name);
      user.name = un;
      Object.assign(u, user);
      typeCastUsers.push(u);
    });
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
   *  Return shuffled User[] as
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
   *  Assign each element to their neighbouring 
   *  element in shuffled user[] to prevent 
   *  self-assignment & mutual assignment.
   *
   *  Because elements are shuffled each time before
   *  this operation, the assignment will always
   *  be different.
   *
   *  Return User[] with assignments as 
   *  Observable<User[]>.
   */
  assignUsers(users: User[]): Observable<User[]> {
    let usersWithAssignment: User[];

    this.castUsers(users)
      .first()
      .subscribe(users => usersWithAssignment = users);

    users.map(
      (user, index) => usersWithAssignment[index].assignment = (index != users.length - 1) ? users[index + 1] : users[0]
    );
    if(users.length == 0) {
      console.error("UserService: (assignUsers) provided any[] has no elements");
      return Observable.of([]);
    } else {
      localStorage.setItem("gilt.secret-santa.UserService.usersWithAssignment", JSON.stringify(usersWithAssignment));
      return Observable.of(usersWithAssignment);
    }
  }

  /*
   *  @method getNewUsersWithAssignment
   *
   *  1. Get any[] from cache or REST api.
   *  2. Type cast any[] to User[].
   *  3. Shuffle User[].
   *  4. Assign a User to each User, secret santa
   *     recipient.
   *
   *  Return User[] with assignments as
   *  Observable<User[]>
   */
  getNewUsersWithAssignment(): Observable<User[]> {  
      return this.getUsers()
        .flatMap(users => this.castUsers(users))
        .flatMap(users => this.shuffleUsers(users))
        .flatMap(users => this.assignUsers(users))
  }

  /*
   *  @method getUsersWithAssignment
   *
   *  Get User[] with assignments from
   *  localStorage cache.
   *
   *  If User[] not available from
   *  localStorage cache get new User[]
   *  from this.getNewUsersWithAssignment().
   *
   *  Return as Observable<User[]>.
   */
  getUsersWithAssignment(): Observable<User[]> {
    let usersWithAssignment = JSON.parse(localStorage.getItem("gilt.secret-santa.UserService.usersWithAssignment"));
    if(usersWithAssignment) {
      console.info("UserService: (getUsersWithAssignment) cached JSON data found in localStorage");
      console.info("UserService: (getUsersWithAssignment) getting cached User[]");
      this.castUsers(usersWithAssignment)
        .first()
        .subscribe(users => usersWithAssignment = users);
      return Observable.of(usersWithAssignment);
    } else {
      console.error("UserService: (getUsersWithAssignment) no cached JSON data found in localStorage");
      console.info("UserService: (getUsersWithAssignment) getting new User[] from 'UserService.getNewUsersWithAssignment'");
      return this.getNewUsersWithAssignment();
    }
  }

  /*
   *  @method getUserWithAssignment
   *
   *  Attempt to retrieve unique User
   *  using provided parameter string[].
   *  
   *  Return as Observable<User[]>.
   */
  getUserWithAssignment(name: string[]): Observable<User[]> {
    return this.getUsersWithAssignment()
      .map(users => this.filterUsersByName(users, name, 'AND'))
  }

  /*
   *  @method authUser
   *
   *  Simple client-side user
   *  authorisation.
   *
   *  Authenticate provided elements
   *  against provided User. If mismatch
   *  authorisation fails. If all match
   *  authorisation is successful.
   *
   *  If successful cache auth token in
   *  sessionStorage.
   *
   *  Return as boolean.  
   */
  authUser(user: User, form: any): boolean {
    if(user.email != form.email) return false;
    if(user.phone.replace("+", "") != form.phone) return false;
    sessionStorage.setItem("gilt.secret-santa.UserService." + user.guid + ".auth", "true");
    return true;
  }

  /*
   *  @method filterUsersByName
   *
   *  Filter provided User[] using
   *  provided filter string[].
   *
   *  Return as User[];
   */
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
