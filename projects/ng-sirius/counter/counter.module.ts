import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { SirCounterComponent } from './counter.component';
import { SirInputModule } from 'ng-sirius/input';

@NgModule({
    declarations: [SirCounterComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SirInputModule
    ],
    exports: [
        SirCounterComponent
    ]
})
export class SirCounterModule { }