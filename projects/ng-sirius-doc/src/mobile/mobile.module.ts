import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileRoutingModule } from './mobile-routing.module';
import { MobileComponent } from './mobile.component';
import { SirSkuModule } from 'ng-sirius/sku';


@NgModule({
  declarations: [MobileComponent],
  imports: [
    CommonModule,
    MobileRoutingModule,
    SirSkuModule
  ]
})
export class MobileModule { }
