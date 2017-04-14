import { Observable } from 'rxjs/Observable';

import { Component, OnInit } from '@angular/core';

// services
import { ListService } from './list.service';
import { LoaderService } from '../shared/components/loader/loader.service';

// models
import { User } from './models/user.model';
import { Assignment } from './models/assignment.model';

@Component({
  selector: 'ss-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public users: User[];
  public assignments: Assignment[];

  constructor(
    private listService: ListService
  ) {}

  /*
   *  @method getUsers
   *
   *  Subscribe to user data Observable<User[]>
   *  from ListService.
   *
   *  Assign User[] to this.users, call
   *  this.assignReceipients method to shuffle
   *  and assign users for secret santa.
   */
  getUsers(): void {
    this.listService.getUsers()
      .subscribe(
        users => {
          this.users = users;
          this.assignRecipients(users);
        }
      )
  } 

  /*
   *  @method assignRecipients
   *
   *  Assign each user/santa with a recipient.
   *
   *  1.  Shuffle the this.users User[] & assign
   *      to shuffledUsers [].
   *
   *  2.  Transform shuffledUsers [] 
   *      to add new property 'assignment'.
   *
   *      After array has been shuffled, users are
   *      assigned to their neighbouring user to
   *      prevent self-assignment & mutual assignment.
   *
   *  3.  Assign shuffled & transformed 
   *      shuffledUsers [] back to this.users 
   *      User[].
   */
  assignRecipients(users) {
    this.shuffle(users, shuffledUsers => {
      this.assignments = <Assignment[]>shuffledUsers
        .map((user, index) => {
          let assignment = (index != shuffledUsers.length - 1) ? shuffledUsers[index + 1] : shuffledUsers[0];
          return {
            name: {
              first: user.name.first,
              last: user.name.last
            },
            email: user.email,
            phone: user.phone,
            assignment: assignment
          }
        });
    });
  }

  /*
   *  @method shuffle
   *
   *  Durstendfeld implementation of
   *  the Fisher-Yates shuffle algorithm.
   *
   *  For each element of the array 
   *  select a random element and swap 
   *  it with the current element.
   *
   *  Returns shuffled array as a
   *  callback.
   */ 
  shuffle(array: User[], callback) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    callback(array);
  }

  ngOnInit() {
    this.getUsers();
  }

}
