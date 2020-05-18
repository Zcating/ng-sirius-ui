import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

import { SirSkuComponent } from './sir-sku.component';
import { SirDrawerModule } from 'ng-sirius/drawer/drawer.module';



@NgModule({
  declarations: [
    SirSkuComponent
  ],
  imports: [
    CommonModule,
    OverlayModule,
    SirDrawerModule
  ],
  exports: [
    SirSkuComponent
  ]
})
export class SirSkuModule { }
