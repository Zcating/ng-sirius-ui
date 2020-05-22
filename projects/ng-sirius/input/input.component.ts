import { HostBinding, Input, Renderer2, ElementRef, OnChanges, SimpleChanges, Component, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'input[sir-input]',
    exportAs: 'sirInput',
    template: '',
    styleUrls: ['./input.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SirInputComponent implements OnChanges {
    @Input() size: 'default' | 'large' | 'small' = 'default';
    @Input() @HostBinding('class.sir-input-disabled') disabled = false;

    @HostBinding('class.sir-input-lg') get isLarge() {
        return this.size === 'large';
    }


    @HostBinding('class.sir-input-lg') get isSmall() {
        return this.size === 'small';
    }

    disabled$ = new Subject<boolean>();

    constructor(private renderer: Renderer2, public elementRef: ElementRef<HTMLInputElement>) {
        this.renderer.addClass(elementRef.nativeElement, 'sir-input');
    }

    ngOnChanges(changes: SimpleChanges) {
        const { disabled } = changes;
        if (disabled) {
            this.disabled$.next(this.disabled);
        }
    }
}
