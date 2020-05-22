import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { SirCounterComponent } from './counter.component';
import { SirInputModule } from 'ng-sirius/input';
import { SirButtonModule } from 'ng-sirius/button';

@NgModule({
    declarations: [SirCounterComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SirInputModule,
        SirButtonModule
    ],
    exports: [
        SirCounterComponent
    ]
})
export class SirCounterModule { }