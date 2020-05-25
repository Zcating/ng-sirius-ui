import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

import { SirSkuComponent } from './sku.component';
import { SirSkuRowComponent } from './components/sku-row.component';
import { SirDrawerModule } from 'ng-sirius/drawer/drawer.module';
import { SirCounterModule } from 'ng-sirius/counter';
import { SkuService } from './sku.service';
import { SkuDataProvider } from './sku-data.provider';



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
  providers: [
    SkuService,
    SkuDataProvider
  ],
  exports: [
    SirSkuComponent
  ]
})
export class SirSkuModule { }
