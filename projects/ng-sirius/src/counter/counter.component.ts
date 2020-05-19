import { Component, ChangeDetectionStrategy, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type Functor<T> = (value: T) => void;

@Component({
    selector: 'sir-counter',
    styleUrls: ['./counter.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SirCounterComponent),
        multi: true
    }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="sir-counter">
            <div class="sir-counter-add" click="add()">-</div>
            <input sir-input class="sir-counter-input" [(ngModel)]="value">
            <div class="sir-counter-minus" click="minus()">+</div>
        </div>
    `,
})
export class SirCounterComponent implements ControlValueAccessor, OnChanges {

    @Input() max: number = 10;
    @Input() min: number = -10;

    value: number = 0;
    private onChange?: Functor<number>;


    ngOnChanges(simpleChanges: SimpleChanges) {
        const { value } = simpleChanges;
        if (value) {
            if (value?.currentValue < this.min) {
                this.value = this.min;
            } else if (value?.currentValue > this.max) {
                this.value = this.max;
            }
        }
    }

    add() {
        if (this.value >= this.max) {
            return;
        }
        this.value += 1;
        this.onChange?.call(null, this.value);
    }

    minus() {
        if (this.value <= this.min) {
            return;
        }
        this.value -= 1;
        this.onChange?.call(null, this.value);
    }

    writeValue(obj: number): void {
        this.value = obj;
    }

    registerOnChange(fn: Functor<number>): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {

    }

}