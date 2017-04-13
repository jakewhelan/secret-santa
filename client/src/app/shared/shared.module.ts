// imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// components
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LoaderComponent
  ],
  exports: [
    // @angular modules
    HttpModule,
    FormsModule,

    // components
    LoaderComponent
  ]
})
export class SharedModule { }
