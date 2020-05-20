import { Component, OnInit, Input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';

@Component({
	selector: 'sir-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SirButtonComponent implements OnInit {

	@Input() disabled: boolean = false;
	@Input() style: 'primary' = 'primary';
	constructor() { }

	ngOnInit(): void {
	}

}
