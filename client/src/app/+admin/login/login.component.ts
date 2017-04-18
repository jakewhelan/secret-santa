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

  public username: string = "admin";
  public password: string = "admin";
  public authState: number = 0;

  constructor(
    private router: Router
  ) {}

  onFormSubmit(form: any): void {
    let authorisation = (this.username == form.user && this.password == form.pass);
    if(authorisation) {
      this.authState = 2;
      sessionStorage.setItem("gilt.secret-santa.UserService.admin.auth", "true");
      this.login();
    } else {
      this.authState = 1;
    }
  }

  login() {
    this.router.navigate(['admin/dashboard']); 
  }

  ngOnInit() {
    if(sessionStorage.getItem("gilt.secret-santa.UserService.admin.auth") == "true") {
      this.login();
    }
  }

}
