import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// routing module
import { ProfileRoutingModule } from './profile.routes';

// shared module
import { SharedModule } from '../shared/shared.module';

// components
import { ProfileComponent } from './profile.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule
  ],
  declarations: [
    ProfileComponent, 
    LoginComponent, 
    DashboardComponent
  ]
})
export class ProfileModule { }
