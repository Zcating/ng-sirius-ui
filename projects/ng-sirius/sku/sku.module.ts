import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

import { SirSkuComponent } from './sku.component';
import { SirSkuRowComponent } from './components/sku-row.component';
import { SirDrawerModule } from 'ng-sirius/drawer/drawer.module';
import { SirStepperModule } from 'ng-sirius/stepper';
import { SkuService } from './sku.service';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SirSkuComponent,
    SirSkuRowComponent
  ],
  imports: [
    CommonModule,
    OverlayModule,
    SirDrawerModule,
    SirStepperModule,
    FormsModule
  ],
  providers: [
    SkuService
  ],
  exports: [
    SirSkuComponent
  ]
})
export class SirSkuModule { }
