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
  public filterTerms: string = "";

  constructor(
    private userService: UserService
  ) {}

  /*
   *  @method getUsersWithAssignment
   *
   *  Subscribe to Observable<User[]>
   *  from ListService.
   *
   *  Assign User[] to this.users &
   *  this.filteredUsers.
   *
   *  View will render using
   *  this.filteredUsers.
   */
  getUsersWithAssignment(): void {
    this.userService.getUsersWithAssignment()
      .first()
      .subscribe(users => {
        this.users = users
        this.filteredUsers = users;
      });
  }

  /*
   *  @method applyFilterTerms
   *
   *  Simple interface for 
   *  this.filterUsersByName.
   */
  applyFilterTerms(): void {
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
      .filterUsersByName(users, this.filterTerms.split(" "), "AND");
  }

  ngOnInit() {
    this.getUsersWithAssignment();
  }

}
