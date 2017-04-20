import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { ProfileComponent } from './profile.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { 
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: ':name', 
        component: LoginComponent,
        data: { title: 'Login | Secret Santa | Gilt' },
      },
      {
        path: ':name/dashboard', 
        component: DashboardComponent,
        data: { title: 'Dashboard | Secret Santa | Gilt' },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ProfileRoutingModule { }
