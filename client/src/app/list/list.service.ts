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
    const endpoint = "http://localhost:3000/api/users2333/";
    if(this.users && !forceHttpGet) {
      console.info("ListService: (getUsersWithAssignment) getting cached user data")
      return Observable.of(this.users);
    } else {
      console.info("ListService: (getUsers) get -> " + endpoint);
      return this.http
        .get(endpoint)
        .map(response => {
          let users = response.json().users;
          this.users = users;
          return users;
        })
        .catch(error =>{
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
   *  Returns any[] as Observable<User[]>.
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
    users.map(
      (user, index) => user.assignment = (index != users.length - 1) ? users[index + 1] : users[0]
    )
    this.usersWithAssignment = users;
    return Observable.of(users);
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
    if(this.usersWithAssignment) {
      console.info("ListService: (getCachedUsersWithAssignment) getting cached User[]");
      return Observable.of(this.usersWithAssignment);
    } else {
      console.error("ListService: (getCachedUsersWithAssignment) no cached User[] 'this.usersWithAssignment'")
      console.info("ListService: (getCachedUsersWithAssignment) getting User[] from 'this.getUsersWithAssignment'")
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
      return this.shuffleUsers(this.typeCastUsers)
        .flatMap(users => this.assignUsers(users))
    } else {
      console.error("ListService: (getReshuffledUsers) no cached User[] 'this.typeCastUsers'")
      console.info("ListService: (getReshuffledUsers) getting User[] from 'this.getUsersWithAssignment'")
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

}
