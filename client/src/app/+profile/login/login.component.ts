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

  getCachedIndividualUserWithAssignment(): void {
    this.userService.getCachedIndividualUserWithAssignment(this.name)
      .first()
      .subscribe(users => {
        if(users.length != 1) {
          console.error('ProfileComponent: (getCachedUserWithAssignment) no exact match found for User')
          this.router.navigateByUrl('/');
        } else {
          console.info('ProfileComponent: (getCachedUserWithAssignment) exact match found for User')
          this.user = users[0];
        }
      });
  }

  getRouteParams(): void {
    this.route.params
      .first()
      .subscribe(params => {
        this.param = params['name']
        this.name = this.param.split('-');
      });
  }

  onFormSubmit(form: any): void {
    let authorisation = this.userService.authUser(this.user, form);
    if(authorisation) {
      this.authState = 2;
      this.login();
    } else {
      this.authState = 1;
      console.log("boohoo!!");
    }
  }

  login() {
    this.router.navigate(['profile', this.param, 'dashboard']); 
  }

  ngOnInit() {
    this.getRouteParams();
    this.getCachedIndividualUserWithAssignment();
    if(sessionStorage.getItem("gilt.secret-santa.UserService." + this.user.guid + ".auth") == "true") {
      this.login();
    }
  }

}
