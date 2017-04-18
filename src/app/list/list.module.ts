import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// routing module
import { ListRoutingModule } from './list.routes';

// shared module
import { SharedModule } from '../shared/shared.module';

// components
import { ListComponent } from './list.component';

@NgModule({
  imports: [
    CommonModule,
    ListRoutingModule,
    SharedModule
  ],
  declarations: [
    ListComponent
  ],
  providers: []
})
export class ListModule { }
