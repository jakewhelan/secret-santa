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

  public param: string;
  public name: string[] = null;
  public user: User;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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
        this.getCachedIndividualUserWithAssignment();
      });
  }

  logout() {
    sessionStorage.removeItem("gilt.secret-santa.UserService." + this.user.guid + ".auth");
    this.router.navigate(['profile', this.param]); 
  }

  ngOnInit() {
     this.getRouteParams();
  }

}