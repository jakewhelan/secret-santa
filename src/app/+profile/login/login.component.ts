import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// services
import { UserService } from '../../shared/services/user/user.service';
// data models
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'ss-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public param: string = null;
  public name: string[] = null;
  public user: User = null;
  public authState: number = 0;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

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
          console.error('ProfileComponent: (getUserWithAssignment) no exact match found for User')
          this.router.navigateByUrl('/');
        } else {
          console.info('ProfileComponent: (getUserWithAssignment) exact match found for User')
          this.user = users[0];
          if(sessionStorage.getItem("gilt.secret-santa.UserService." + this.user.guid + ".auth") == "true") {
            this.login();
          }
        }
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
      });
  }

  /*
   *  @method onFormSubmit
   *
   *  Event handlers for login form
   *  submission. Request authorisation
   *  from userService.
   *
   *  If successful login, UserService
   *  will create and cache auth token in
   *  localSession. If unsuccessful 
   *  display error message.
   */
  onFormSubmit(form: any): void {
    let authorisation = this.userService.authUser(this.user, form);
    if(authorisation) {
      this.authState = 2;
      this.login();
    } else {
      this.authState = 1;
    }
  }

  /* 
   *  @method login
   *
   *  Route authorised user to dashboard.
   */
  login() {
    this.router.navigate(['profile', this.param, 'dashboard']); 
  }

  ngOnInit() {
    this.getRouteParams();
    this.getUserWithAssignment();
  }

}
