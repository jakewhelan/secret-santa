import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// routing module
import { AdminRoutingModule } from './admin.routes';

// shared module
import { SharedModule } from '../shared/shared.module';

// components
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
  declarations: [
    AdminComponent, 
    LoginComponent, 
    DashboardComponent
  ]
})
export class AdminModule { }
