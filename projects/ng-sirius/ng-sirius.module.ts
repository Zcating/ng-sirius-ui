import { NgModule } from '@angular/core';
import { SirSkuModule } from './sku/sir-sku.module';
import { SirDrawerModule } from './drawer/drawer.module';
import { SirButtonModule } from './button';

@NgModule({
    imports: [
        SirSkuModule,
        SirDrawerModule,
        SirButtonModule
    ],
    exports: [
        SirSkuModule,
        SirDrawerModule,
        SirButtonModule
    ],
})
export class NgSiriusModule { }
