import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SirDrawerComponent } from './drawer.component';



@NgModule({
  declarations: [SirDrawerComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    SirDrawerComponent
  ]
})
export class SirDrawerModule { }
