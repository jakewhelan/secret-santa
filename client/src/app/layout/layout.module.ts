import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// components
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    HeaderComponent, 
    FooterComponent, 
    PageNotFoundComponent
  ],
  exports: [
    RouterModule,
    
    HeaderComponent, 
    FooterComponent, 
    PageNotFoundComponent
  ]
})
export class LayoutModule { }
