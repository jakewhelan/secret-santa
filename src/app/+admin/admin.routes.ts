import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { 
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '', 
        component: LoginComponent,
        data: { title: 'Admin Login | Secret Santa | Gilt' },
      },
      {
        path: 'dashboard', 
        component: DashboardComponent,
        data: { title: 'Admin Dashboard | Secret Santa | Gilt' },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminRoutingModule { }
