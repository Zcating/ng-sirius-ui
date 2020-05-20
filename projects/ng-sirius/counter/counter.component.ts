import { Component, ChangeDetectionStrategy, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { toCssPixel } from 'ng-sirius/core/utils/convert';
import { SirAny } from 'ng-sirius/core/types/any';

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
        <div class="sir-counter" [style.height]="cssHeight">
            <button
                class="sir-counter-minus"
                [class.sir-counter-btn-disabled]="minusDisabled"
                (click)="decrease()"
            >-</button>
                <input sirInput class="sir-counter-input" [(ngModel)]="value" />
            <button
                class="sir-counter-plus"
                [class.sir-counter-btn-disabled]="plusDisabled"
                (click)="increase()"
            >+</button>
        </div>
    `,
})
export class SirCounterComponent implements ControlValueAccessor, OnChanges {

    @Input() max: number = 10;
    @Input() min: number = -10;

    @Input() height: string = '24px';

    value: number = 0;

    get cssHeight() {
        return toCssPixel(this.height);
    }

    get minusDisabled() {
        return this.value <= this.min;
    }

    get plusDisabled() {
        return this.value >= this.max;
    }

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

    increase() {
        console.log('fuck');
        if (this.value >= this.max) {
            return;
        }
        this.value += 1;
        this.onChange?.call(null, this.value);
    }

    decrease() {
        if (this.value <= this.min) {
            return;
        }
        this.value -= 1;
        this.onChange?.call(null, this.value);
    }

    writeValue(obj: SirAny): void {
        this.value = Number(obj);
    }

    registerOnChange(fn: Functor<number>): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {

    }

}