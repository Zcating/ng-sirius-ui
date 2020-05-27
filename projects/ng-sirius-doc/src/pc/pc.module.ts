import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PcComponent } from './pc.component';
import { PcRoutingModule } from './pc-routing.module';
import { SkuDocComponent } from './pages/sku-doc/sku-doc.component';
import { CommonModule } from '@angular/common';



@NgModule({
    declarations: [
        PcComponent,
        SkuDocComponent
    ],
    imports: [
        PcRoutingModule,
        CommonModule
    ],

    exports: [

    ]
})
export class PcModule {

}
