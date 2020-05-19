import { NgModule } from "@angular/core";
import { SirInputDirective } from './input.directive';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        SirInputDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        SirInputDirective
    ]
})
export class SirInputModule {}