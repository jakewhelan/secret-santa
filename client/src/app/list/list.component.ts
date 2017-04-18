import { Component, OnInit } from '@angular/core';

// services
import { UserService } from '../shared/services/user/user.service';
import { LoaderService } from '../shared/components/loader/loader.service';

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
   *  @method getUsers
   *
   *  Subscribe to Observable<User[]>
   *  from ListService.
   *
   *  Assign User[] to this.users
   */
  getCachedUsersWithAssignment(): void {
    this.userService.getCachedUsersWithAssignment()
      .map(users => this.filterUsersByName(users))
      .first()
      .subscribe(users => {
        this.users = users
        this.filteredUsers = users;
      });
  } 

  getReassignedUsers(): void {
    this.userService.getReassignedUsers()
      .map(users => this.filterUsersByName(users))
      .first()
      .subscribe(users => {
        this.users = users;
        this.filteredUsers = users;
      });
  }

  applySearchTerms(): void {
    this.filteredUsers = this.filterUsersByName(this.users);
  }

  filterUsersByName(users: User[]): User[] {
    return this.userService
      .filterUsersByName(users, this.searchTerms.split(" "), "AND");
  }

  ngOnInit() {
    this.getCachedUsersWithAssignment();
  }

}
