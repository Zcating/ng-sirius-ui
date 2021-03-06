import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgSiriusModule } from 'projects/ng-sirius';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgSiriusModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
