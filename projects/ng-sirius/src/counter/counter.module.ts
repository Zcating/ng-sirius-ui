import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { SirCounterComponent } from './counter.component';

@NgModule({
    declarations: [SirCounterComponent],
    imports: [
        CommonModule,
        FormsModule, 
        ReactiveFormsModule
    ],
    exports: [
        SirCounterComponent
    ]
})
export class SirCounterModule { }