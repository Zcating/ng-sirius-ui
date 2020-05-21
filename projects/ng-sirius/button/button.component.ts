import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { SirClassType } from 'ng-sirius/core/types/klass';

@Component({
	selector: 'sir-button',
	templateUrl: './button.component.html',
	styleUrls: ['./style/button.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class SirButtonComponent implements OnInit {

	@Input() disabled: boolean = false;
	@Input() size: 'large' | 'default' | 'small' = 'default';
	@Input() style: 'primary' | 'default' | 'dash' = 'primary';
	@Input() sirClass: SirClassType = '';

	@Output() sirClick = new EventEmitter<Event>();

	constructor() { }

	ngOnInit(): void {
	}

	sirOnClick(event: Event) {
		this.sirClick.emit(event);
	}
}
