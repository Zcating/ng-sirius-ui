import {
    Component,
    OnInit, Input,
    Output,
    EventEmitter,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ElementRef,
    HostBinding
} from '@angular/core';
import { SirClassType } from 'ng-sirius/core/types/klass';

@Component({
    selector: `button[sir-button]`,
    exportAs: 'sirButton',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class SirButtonComponent implements OnInit {

    @Input() style: 'primary' | 'default' | 'dash' = 'default';

    @Input() disabled: boolean = false;
    @HostBinding('[attr.disabled]') get isDisabled() { return this.disabled || null; }
    @HostBinding('[class.sir-button-default]') get isDefault() { return this.style === 'default'; }
    @HostBinding('[class.sir-button-primary]') get isPrimary() { return this.style === 'primary'; }

    constructor(private elementRef: ElementRef) {
        (this.elementRef.nativeElement as HTMLElement).classList.add('sir-button');
    }

    ngOnInit(): void {
    }
}
