import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  { 
    path: '', component: ProfileComponent, 
    data: { title: 'Secret Santa | Gilt Groupe' } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ProfileRoutingModule { }
