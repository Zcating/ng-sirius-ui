import { Directive, HostBinding, Input, Renderer2, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
    selector: 'input[sirInput]',
    exportAs: 'sirInput'
})
export class SirInputDirective implements OnChanges {
    @Input() size: 'default' | 'large' | 'small' = 'default';
    @Input() @HostBinding('class.sir-input-disabled') disabled = false;

    @HostBinding('class.sir-input-lg') get isLarge() {
        return this.size === 'large';
    }


    @HostBinding('class.sir-input-lg') get isSmall() {
        return this.size === 'small';
    }

    disabled$ = new Subject<boolean>();

    constructor(private renderer: Renderer2, elementRef: ElementRef) {
        this.renderer.addClass(elementRef.nativeElement, 'sir-input');
    }

    ngOnChanges(changes: SimpleChanges) {
        const {disabled} = changes;
        if (disabled) {
            this.disabled$.next(this.disabled);
        }
    }
}
