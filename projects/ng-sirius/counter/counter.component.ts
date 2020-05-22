import { Component, ChangeDetectionStrategy, forwardRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { toCssPixel } from 'ng-sirius/core/utils/convert';
import { SirAny } from 'ng-sirius/core/types/any';
import { SirInputComponent } from 'ng-sirius/input';

type Functor<T> = (value: T) => void;

function toNumber(obj: SirAny, tmp: number = NaN) {
    const num = Number(obj);
    return Number.isNaN(num) ? tmp : num;
}

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
                sir-button
                class="sir-counter-minus"
                [style.height]="cssHeight"
                [style.width]="cssHeight"
                [style.min-width]="cssHeight"
                [disabled]="minusDisabled"
                (click)="decrease()"
            >-</button>
                <input
                    #inputComponent
                    sir-input
                    class="sir-counter-input"
                    [attr.min]="sirMin"
                    [attr.max]="sirMax"
                    [ngModel]="value"
                    (ngModelChange)="setValue($event)"
                />
            <button
                sir-button
                class="sir-counter-plus"
                [style.height]="cssHeight"
                [style.width]="cssHeight"
                [style.min-width]="cssHeight"
                [disabled]="plusDisabled"
                (click)="increase()"
            >+</button>
        </div>
    `,
})
export class SirCounterComponent implements ControlValueAccessor, OnChanges {

    @Input() sirMax: number = 10;
    @Input() sirMin: number = 0;
    @Input() sirStep: number = 1;

    @Input() height: string = '32px';

    @ViewChild('inputComponent') inputComponent!: SirInputComponent;

    value: number = 0;

    get cssHeight() {
        return toCssPixel(this.height);
    }

    get minusDisabled() {
        return this.value <= this.sirMin;
    }

    get plusDisabled() {
        return this.value >= this.sirMax;
    }

    private onChange?: Functor<number>;

    constructor() {

    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        const { value } = simpleChanges;
        if (value) {
            if (value?.currentValue < this.sirMin) {
                this.value = this.sirMin;
            } else if (value?.currentValue > this.sirMax) {
                this.value = this.sirMax;
            }
        }
    }

    increase() {
        if (this.value >= this.sirMax) {
            return;
        }
        this.value += 1;
        this.onChange?.call(null, this.value);
    }

    decrease() {
        if (this.value <= this.sirMin) {
            return;
        }
        this.value -= 1;
        this.onChange?.call(null, this.value);
    }

    setValue(obj: string | number) {
        // TODO: add filter.
        this.value = toNumber(obj, 0);
        if (this.value < this.sirMin) {
            this.value = this.sirMin;
        } else if (this.value > this.sirMax) {
            this.value = this.sirMax;
        }
        this.inputComponent.elementRef.nativeElement.value = `${this.value}`;
    }

    writeValue(obj: SirAny): void {
        this.value = toNumber(obj, 0);
    }

    registerOnChange(fn: Functor<number>): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {

    }

}