import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

import { SirSkuComponent } from './sku.component';
import { SirSkuRowComponent } from './compoenents/sku-row.component';
import { SirDrawerModule } from 'ng-sirius/drawer/drawer.module';
import { SirCounterModule } from 'ng-sirius/counter';



@NgModule({
  declarations: [
    SirSkuComponent,
    SirSkuRowComponent
  ],
  imports: [
    CommonModule,
    OverlayModule,
    SirDrawerModule,
    SirCounterModule,
  ],
  exports: [
    SirSkuComponent
  ]
})
export class SirSkuModule { }
