import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// routing module
import { AppRoutingModule } from './app.routes';

// root modules
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';
import { ListModule } from './list/list.module';

// components
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    SharedModule,
    ListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
