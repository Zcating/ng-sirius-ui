import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SirSkuComponent } from './sir-sku.component';
import { OverlayModule } from '@angular/cdk/overlay';



@NgModule({
  declarations: [
    SirSkuComponent
  ],
  imports: [
    CommonModule,
    OverlayModule
  ],
  exports: [
    SirSkuComponent
  ]
})
export class SirSkuModule { }
