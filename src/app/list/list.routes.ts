import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { ListComponent } from './list.component';

const routes: Routes = [
  { 
    path: '', component: ListComponent, 
    data: { title: 'Secret Santa | Gilt' } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ListRoutingModule { }
