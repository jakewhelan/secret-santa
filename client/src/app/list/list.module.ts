import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// routing module
import { ListRoutingModule } from './list.routes';

// components
import { ListComponent } from './list.component';

// services
import { ListService } from './list.service';

@NgModule({
  imports: [
    CommonModule,
    ListRoutingModule
  ],
  declarations: [
    ListComponent
  ],
  providers: [ListService]
})
export class ListModule { }
