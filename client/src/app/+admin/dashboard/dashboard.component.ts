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

  logout() {
    sessionStorage.removeItem("gilt.secret-santa.UserService.admin.auth");
    this.router.navigate(['admin']); 
  }

  ngOnInit() {
    this.getCachedUsersWithAssignment();
  }

}