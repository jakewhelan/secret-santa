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
import { GiftService } from './dashboard/gift.service';

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
  ],
  providers: [GiftService]
})
export class ProfileModule { }
