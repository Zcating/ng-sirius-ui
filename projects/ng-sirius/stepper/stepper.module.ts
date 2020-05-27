import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SirStepperComponent } from './stepper.component';
import { SirInputModule } from 'ng-sirius/input';
import { SirButtonModule } from 'ng-sirius/button';

@NgModule({
    declarations: [SirStepperComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SirInputModule,
        SirButtonModule
    ],
    exports: [
        SirStepperComponent
    ]
})
export class SirStepperModule { }