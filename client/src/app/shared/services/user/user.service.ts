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

  private users: any[] = null;
  private typeCastUsers: User[] = null;
  private usersWithAssignment: User[] = null;
  private selectedUser: User = null;

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
    this.users = this.users || JSON.parse(localStorage.getItem("gilt.secret-santa.UserService.users"));
    if(this.users && !forceHttpGet) {
      console.info("UserService: (getUsersWithAssignment) getting cached any[]")
      return Observable.of(this.users);
    } else {
      console.info("UserService: (getUsers) get -> " + endpoint);
      return this.http
        .get(endpoint)
        .map(response => {
          let users = response.json().users;
          this.users = users;
          localStorage.setItem("gilt.secret-santa.UserService.users", JSON.stringify(users));
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
    localStorage.setItem("gilt.secret-santa.UserService.usersWithAssignment", JSON.stringify(usersWithAssignment));
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
  }

  /*
   *  @method getCachedUsersWithAssignment
   *
   *  Returns users with secret santa 
   *  assignments from local service cache.
   */
  getCachedUsersWithAssignment(): Observable<User[]> {
    let _localStorage = {
      usersWithAssignment: JSON.parse(localStorage.getItem("gilt.secret-santa.UserService.usersWithAssignment"))
    }
    if(_localStorage.usersWithAssignment) {
      console.log("localstorage?");
      console.info("UserService: (getCachedUsersWithAssignment) cached JSON data found in localStorage");
      this.castUsers(JSON.parse(JSON.stringify(_localStorage.usersWithAssignment)))
        .first()
        .subscribe(users => this.usersWithAssignment = users);
    }
    if(this.usersWithAssignment) {
      console.log(this.usersWithAssignment);
      console.info("UserService: (getCachedUsersWithAssignment) getting cached User[]");
      return Observable.of(this.usersWithAssignment);
    } else {
      console.error("UserService: (getCachedUsersWithAssignment) no cached User[] 'UserService.usersWithAssignment'");
      console.info("UserService: (getCachedUsersWithAssignment) getting User[] from 'UserService.getUsersWithAssignment'");
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
    return this.getUsersWithAssignment();
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

  getCachedIndividualUserWithAssignment(name: string[]): Observable<User[]> {
    return this.getCachedUsersWithAssignment()
      .map(users => this.filterUsersByName(users, name, 'AND'))
      .map(user => {
        return user;
      })
  }

  authUser(user: User, form: any): boolean {
    console.log(user, form);
    if(user.email != form.email) return false;
    if(user.phone.replace("+", "") != form.phone) return false;
    sessionStorage.setItem("gilt.secret-santa.UserService." + user.guid + ".auth", "true");
    return true;
  }

}
