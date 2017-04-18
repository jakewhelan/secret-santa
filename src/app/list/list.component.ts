import { Component, OnInit } from '@angular/core';

// services
import { UserService } from '../shared/services/user/user.service';

// data models
import { User } from '../shared/models/user.model';
import { Name } from '../shared/models/name.model';

@Component({
  selector: 'ss-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public users: User[];
  public filteredUsers: User[];
  public searchTerms: string = "";

  constructor(
    private userService: UserService
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
        console.log(users);
        this.users = users
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

  ngOnInit() {
    this.getUsersWithAssignment();
  }

}
