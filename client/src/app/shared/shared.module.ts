// imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// components
import { UserService } from './services/user/user.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  exports: [
    // @angular modules
    HttpModule,
    FormsModule,
  ],
  providers: [UserService]
})
export class SharedModule { }
