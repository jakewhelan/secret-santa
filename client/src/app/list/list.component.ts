import { Component, OnInit } from '@angular/core';

// services
import { ListService } from './list.service';
import { LoaderService } from '../shared/components/loader/loader.service';

// data models
import { User } from './models/user.model';
import { Name } from './models/name.model';

@Component({
  selector: 'ss-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public users: User[];

  constructor(
    private listService: ListService
  ) {}

  /*
   *  @method getUsers
   *
   *  Subscribe to Observable<User[]>
   *  from ListService.
   *
   *  Assign User[] to this.users
   */
  getUsersWithAssignment(): void {
    this.listService.getUsersWithAssignment()
      .first()
      .subscribe(users => this.users = users)
  } 

  getReassignedUsers(): void {
    this.listService.getReassignedUsers()
      .first()
      .subscribe(users => this.users = users)
  }

  getIndividualUserWithAssignment(name: Name): void {
    this.listService.getIndividualUserWithAssignment(name)
      .first()
      .subscribe(users => this.users = users)//this.users = users)
  }

  ngOnInit() {
    let name = new Name();
    name.first = "Lisa";
    name.last = "Masterson";
    //console.log(name);
    //this.getIndividualUserWithAssignment(name);
    this.getUsersWithAssignment();
  }

}
