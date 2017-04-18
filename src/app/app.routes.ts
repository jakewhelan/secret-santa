import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// components
import { PageNotFoundComponent } from './layout/page-not-found/page-not-found.component';

const routes: Routes = [
  // core routes
  { path: '', loadChildren: './list/list.module#ListModule' },

  // lazy routes
  { path: 'profile', loadChildren: './+profile/profile.module#ProfileModule' },
  { path: 'admin', loadChildren: './+admin/admin.module#AdminModule' },

  // 404 page not found
  { 
    path: '**', pathMatch: 'full', component: PageNotFoundComponent,
    data: { title: '404 Page Not Found | Secret Santa | Gilt Groupe' } 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
