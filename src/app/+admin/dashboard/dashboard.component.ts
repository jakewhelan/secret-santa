import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// services
import { UserService } from '../../shared/services/user/user.service';
// data models
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'ss-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public users: User[];
  public filteredUsers: User[];
  public searchTerms: string = "";

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  /*
   *  @method getUsersWithAssignment
   *
   *  Subscribe to Observable<User[]>
   *  from ListService. Filter returned
   *  User[] with string[] retrieved
   *  from component input element.
   *
   *  Assign User[] to this.users &
   *  this.filteredUsers.
   *
   *  View will render using
   *  this.filteredUsers.
   */
  getUsersWithAssignment(): void {
    this.userService.getUsersWithAssignment()
      .map(users => this.filterUsersByName(users))
      .first()
      .subscribe(users => {
        this.users = users
        this.filteredUsers = users;
      });
  } 

  /*
   *  @method getNewUsersWithAssignment
   *
   *  Get shuffled and reassigned User[].
   *
   *  Subscribe to Observable<User[]>
   *  from ListService. Filter returned
   *  User[] with string[] retrieved
   *  from component input element.
   *
   *  Assign User[] to this.users &
   *  this.filteredUsers.
   *
   *  View will render using
   *  this.filteredUsers.
   */
  getNewUsersWithAssignment(): void {
    this.userService.getNewUsersWithAssignment()
      .map(users => this.filterUsersByName(users))
      .first()
      .subscribe(users => {
        this.users = users;
        this.filteredUsers = users;
      });
  }

  /*
   *  @method applySearchTerms
   *
   *  Simple interface for 
   *  this.filterUsersByName.
   */
  applySearchTerms(): void {
    this.filteredUsers = this.filterUsersByName(this.users);
  }

   /*
   *  @method filterUsersByName
   *
   *  Filter users using string[]
   *  retrieved from component input
   *  element.
   */
  filterUsersByName(users: User[]): User[] {
    return this.userService
      .filterUsersByName(users, this.searchTerms.split(" "), "AND");
  }

  /* 
   *  @method logout
   *
   *  Delete auth token from
   *  localSession cache. Route 
   *  deauthorised user to login. 
   */
  logout() {
    sessionStorage.removeItem("gilt.secret-santa.UserService.admin.auth");
    this.router.navigate(['admin']); 
  }

  ngOnInit() {
    if(sessionStorage.getItem("gilt.secret-santa.UserService.admin.auth") != "true") {
      this.logout();
    }
    this.getUsersWithAssignment();
  }

}