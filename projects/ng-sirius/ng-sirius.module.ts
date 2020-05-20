import { NgModule } from '@angular/core';
import { SirSkuModule } from './sku/sir-sku.module';
import { SirDrawerModule } from './drawer/drawer.module';

@NgModule({
    imports: [
        SirSkuModule,
        SirDrawerModule,
    ],
    exports: [
        SirSkuModule,
        SirDrawerModule
    ],
})
export class NgSiriusModule { }
