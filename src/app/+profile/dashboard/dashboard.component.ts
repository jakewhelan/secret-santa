import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// services
import { UserService } from '../../shared/services/user/user.service';
import { GiftService } from './gift.service';

// data models
import { User } from '../../shared/models/user.model';
import { Gift } from './gift.model';

@Component({
  selector: 'ss-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public param: string;
  public name: string[] = null;
  public user: User;
  public gifts: Gift[];

  constructor(
    private userService: UserService,
    private giftService: GiftService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /*
   *  @method getUserWithAssignment
   *
   *  Subscribe to Observable<User[]>
   *  from UserService. Attempt to 
   *  retrieve unique User using 
   *  query string[] retrieved from
   *  route params.
   *
   *  If more than 1 result is returned
   *  provided user argument is not
   *  unique.
   *
   *  Assign User to this.user.
   */
  getUserWithAssignment(): void {
    this.userService.getUserWithAssignment(this.name)
      .first()
      .subscribe(users => {
        if(users.length != 1) {
          console.error('ProfileComponent: (getCachedUserWithAssignment) no exact match found for User')
          this.router.navigateByUrl('/');
        } else {
          console.info('ProfileComponent: (getCachedUserWithAssignment) exact match found for User')
          this.user = users[0];
          if(sessionStorage.getItem("gilt.secret-santa.UserService." + this.user.guid + ".auth") != "true") {
            this.logout();
          }
        }
      });
  }

  /*
   *  @method getGifts
   *
   *  Subscribe to Observable<Gift[]>
   *  from GiftService. 
   *
   *  Assign Gift[] to this.gifts.
   *
   *  View will render using
   *  this.gifts.
   */
  getGifts(): void {
    this.giftService.getGifts()
      .first()
      .subscribe(gifts => {
        this.gifts = gifts;
      });
  }


  /*
   *  @method getRouteParams
   *
   *  Subscribe to params from
   *  Router.
   *
   *  Assign string[] for later use
   *  as argument for filtering. Assign 
   *  string for later use in routing.
   */
  getRouteParams(): void {
    this.route.params
      .first()
      .subscribe(params => {
        this.param = params['name']
        this.name = this.param.split('-');
        this.getUserWithAssignment();
        this.getGifts();
      });
  }

  /* 
   *  @method logout
   *
   *  Delete auth token from
   *  localSession cache. Route 
   *  deauthorised user to login. 
   */
  logout() {
    sessionStorage.removeItem("gilt.secret-santa.UserService." + this.user.guid + ".auth");
    this.router.navigate(['profile', this.param]); 
  }

  ngOnInit() {
    this.getRouteParams();
  }

}